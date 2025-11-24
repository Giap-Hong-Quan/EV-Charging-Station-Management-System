<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Service\PaymentService;
use App\Service\MomoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    protected $paymentService;
    protected $momoService;

    public function __construct(PaymentService $paymentService, MomoService $momoService)
    {
        $this->paymentService = $paymentService;
        $this->momoService = $momoService;
    }

    /**
     * Tạo QR Code thanh toán
     */
    public function createQRPayment(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'order_id' => 'required|string|unique:payments,order_id',
                'user_id' => 'required|string',
                'user_email' => 'required|email',
                'user_name' => 'sometimes|string',
                'amount' => 'required|numeric|min:1000|max:20000000',
                'description' => 'sometimes|string'
            ]);

            // Tạo payment record
            $paymentData = array_merge($validated, [
                'payment_method' => 'momo_qr',
                'currency' => 'VND'
            ]);

            $payment = $this->paymentService->createPayment($paymentData);

            // Gọi Momo API tạo QR Code data
            $qrResult = $this->momoService->createQRPayment(
                $payment->order_id,
                $payment->amount,
                $validated['description'] ?? 'Thanh toán QR Code ' . $payment->order_id
            );

            if (isset($qrResult['resultCode']) && $qrResult['resultCode'] == 0) {
                // Cập nhật payment với QR info
                $payment->update([
                    'transaction_id' => $qrResult['requestId'] ?? null,
                    'payment_gateway' => 'momo_qr',
                    'metadata' => [
                        'qr_data' => $qrResult['qr_data'],
                        'scheduled_process_at' => $qrResult['simulator_info']['scheduled_process_at'],
                        'predicted_result' => $qrResult['simulator_info']['predicted_result'],
                        'processing_time_seconds' => $qrResult['simulator_info']['processing_time_seconds'],
                        'auto_determined' => true
                    ]
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'QR Payment tạo thành công',
                    'data' => [
                        'order_id' => $payment->order_id,
                        'payment_id' => $payment->id,
                        'amount' => $payment->amount,
                        'qr_data' => $qrResult['qr_data'],
                        'check_status_url' => url("/api/payments/qr-status/{$payment->order_id}"),
                        'simulator_info' => $qrResult['simulator_info']
                    ]
                ]);
            }

            throw new \Exception('Momo QR error: ' . ($qrResult['message'] ?? 'Unknown error'));

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Create QR Payment error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Kiểm tra trạng thái QR payment
     */
    public function checkQRPaymentStatus($orderId): JsonResponse
    {
        try {
            $statusResult = $this->momoService->checkQRPaymentStatus($orderId);

            return response()->json([
                'success' => true,
                'data' => $statusResult
            ]);

        } catch (\Exception $e) {
            Log::error('Check QR payment status error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // Các method khác giữ nguyên
    public function index(): JsonResponse
    {
        try {
            $payments = Payment::orderBy('created_at', 'desc')->get();
        
            return response()->json([
                'success' => true,
                'data' => $payments,
                'total' => $payments->count()
            ]);
        
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function create(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'order_id' => 'required|string|unique:payments,order_id',
                'user_id' => 'required|string',
                'user_email' => 'required|email',
                'amount' => 'required|numeric|min:0',
                'currency' => 'sometimes|string|size:3',
                'payment_method' => 'required|in:credit_card,bank_transfer,ewallet,cod,momo',
                'description' => 'sometimes|string',
                'metadata' => 'sometimes|array'
            ]);

            $payment = $this->paymentService->createPayment($validated);

            return response()->json([
                'success' => true,
                'data' => $payment,
                'message' => 'Payment created successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function createWithMomo(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'order_id' => 'required|string|unique:payments,order_id',
                'user_id' => 'required|string',
                'user_email' => 'required|email',
                'user_name' => 'sometimes|string',
                'amount' => 'required|numeric|min:1000|max:20000000',
                'description' => 'sometimes|string'
            ]);

            // Tạo payment record
            $paymentData = array_merge($validated, [
                'payment_method' => 'momo',
                'currency' => 'VND'
            ]);

            $payment = $this->paymentService->createPayment($paymentData);

            // Gọi Momo API
            $momoResult = $this->momoService->createPayment(
                $payment->order_id,
                $payment->amount,
                $validated['description'] ?? 'Thanh toán đơn hàng ' . $payment->order_id
            );

            if (isset($momoResult['resultCode']) && $momoResult['resultCode'] == 0) {
                // Cập nhật transaction ID
                $payment->update([
                    'transaction_id' => $momoResult['requestId'] ?? null,
                    'payment_gateway' => 'momo'
                ]);

                return response()->json([
                    'success' => true,
                    'payment_url' => $momoResult['payUrl'],
                    'message' => 'Redirect to Momo payment gateway'
                ]);
            }

            throw new \Exception('Momo error: ' . ($momoResult['message'] ?? 'Unknown error'));

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function momoIpn(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            Log::info('Momo IPN Received:', $data);

            // Verify signature
            if (!$this->momoService->verifySignature($data)) {
                Log::error('Momo IPN signature invalid');
                return response()->json(['success' => false], 400);
            }

            $payment = Payment::where('order_id', $data['orderId'])->first();

            if (!$payment) {
                Log::error('Payment not found for order: ' . $data['orderId']);
                return response()->json(['success' => false], 404);
            }

            // Cập nhật trạng thái payment
            if ($data['resultCode'] == 0) {
                $payment->update([
                    'status' => 'completed',
                    'transaction_id' => $data['transId']
                ]);

                Log::info('Payment completed via Momo', ['payment_id' => $payment->id]);
            } else {
                $payment->update(['status' => 'failed']);
                Log::warning('Payment failed via Momo', ['payment_id' => $payment->id]);
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error('Momo IPN Error: ' . $e->getMessage());
            return response()->json(['success' => false], 500);
        }
    }

    public function paymentSuccess(Request $request): JsonResponse
    {
        $orderId = $request->input('orderId');
        $resultCode = $request->input('resultCode');

        $payment = Payment::where('order_id', $orderId)->first();

        if ($payment && $resultCode == 0) {
            return response()->json([
                'success' => true,
                'message' => 'Payment successful',
                'data' => $payment
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Payment failed or not found'
        ], 400);
    }

    public function show($paymentId): JsonResponse
    {
        try {
            $payment = Payment::findOrFail($paymentId);

            return response()->json([
                'success' => true,
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }
    }

    public function getUserPayments($userId): JsonResponse
    {
        try {
            $payments = $this->paymentService->getUserPayments($userId);

            return response()->json([
                'success' => true,
                'data' => $payments,
                'total' => $payments->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function getByOrderId($orderId): JsonResponse
    {
        try {
            $payment = $this->paymentService->getPaymentByOrderId($orderId);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function getStats(): JsonResponse
    {
        try {
            $stats = $this->paymentService->getPaymentStats();
            return response()->json(['success' => true, 'data' => $stats]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
}