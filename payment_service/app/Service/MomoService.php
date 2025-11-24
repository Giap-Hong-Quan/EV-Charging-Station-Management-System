<?php

namespace App\Service;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MomoService
{
    private $partnerCode;
    private $accessKey;
    private $secretKey;
    private $endpoint;

    public function __construct()
    {
        $this->partnerCode = env('MOMO_PARTNER_CODE', 'MOMOIQA420180417');
        $this->accessKey = env('MOMO_ACCESS_KEY', 'QNGQSuqSJN3keRjW');
        $this->secretKey = env('MOMO_SECRET_KEY', 'ahM2hK5HPfXXb3cO9ZJcFf7xMal4V8qP');
        $this->endpoint = env('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create');
    }

    /**
     * Tạo QR Code data để FE render
     */
    public function createQRPayment($orderId, $amount, $orderInfo = 'Thanh toán QR Code')
    {
        try {
            // HỆ THỐNG TỰ ĐỘNG QUYẾT ĐỊNH kết quả
            $willSucceed = $this->autoDeterminePaymentResult($orderId, $amount);
            
            // Tính thời gian xử lý (10-30 giây)
            $processingTime = rand(10, 30);
            $processAt = now()->addSeconds($processingTime);

            // Data để FE tạo QR Code
            $qrData = [
                'type' => 'momo_payment',
                'order_id' => $orderId,
                'amount' => $amount,
                'description' => $orderInfo,
                'merchant' => 'MOMO_DEMO',
                'timestamp' => time(),
                'bank_code' => 'MOMO',
                'account_number' => '0968889999',
                'account_name' => 'MERCHANT DEMO',
                'callback_url' => url("/api/momo/ipn"),
                'auto_determined' => true,
                'predicted_result' => $willSucceed ? 'success' : 'failed'
            ];

            $response = [
                'resultCode' => 0,
                'message' => 'Tạo QR Payment thành công',
                'orderId' => $orderId,
                'amount' => $amount,
                'qr_data' => $qrData,
                'requestId' => 'QR_' . time(),
                'transId' => 'MOMO_QR_' . time(),
                'responseTime' => time(),
                'simulator_info' => [
                    'type' => 'qr_payment_auto',
                    'auto_determined' => true,
                    'predicted_result' => $willSucceed ? 'success' : 'failed',
                    'processing_time_seconds' => $processingTime,
                    'scheduled_process_at' => $processAt->toISOString()
                ]
            ];

            Log::info('Momo QR Payment Data Created', [
                'order_id' => $orderId,
                'amount' => $amount,
                'predicted_result' => $willSucceed ? 'success' : 'failed'
            ]);

            return $response;

        } catch (\Exception $e) {
            Log::error('Momo QR Payment Error: ' . $e->getMessage());
            return [
                'resultCode' => 99,
                'message' => 'Tạo QR Payment thất bại: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Hệ thống tự động quyết định kết quả thanh toán
     */
    private function autoDeterminePaymentResult($orderId, $amount): bool
    {
        $factors = [
            'amount_factor' => $this->calculateAmountFactor($amount),
            'time_factor' => $this->calculateTimeFactor(),
            'order_hash_factor' => $this->calculateOrderHashFactor($orderId),
            'random_factor' => mt_rand(1, 100) / 100
        ];

        $totalScore = (
            $factors['amount_factor'] * 0.4 +
            $factors['time_factor'] * 0.3 + 
            $factors['order_hash_factor'] * 0.2 +
            $factors['random_factor'] * 0.1
        );

        return $totalScore >= 0.3;
    }

    private function calculateAmountFactor($amount): float
    {
        if ($amount <= 50000) return 0.8;
        if ($amount <= 200000) return 0.9;
        if ($amount <= 1000000) return 0.7;
        return 0.5;
    }

    private function calculateTimeFactor(): float
    {
        $hour = (int) date('H');
        $dayOfWeek = date('N');
        
        if ($dayOfWeek <= 5 && $hour >= 8 && $hour <= 17) return 0.9;
        if ($dayOfWeek >= 6) return 0.7;
        return 0.5;
    }

    private function calculateOrderHashFactor($orderId): float
    {
        $hash = crc32($orderId);
        return ($hash % 100) / 100;
    }

    /**
     * Kiểm tra trạng thái QR payment
     */
    public function checkQRPaymentStatus($orderId)
    {
        try {
            $payment = \App\Models\Payment::where('order_id', $orderId)->first();
            
            if (!$payment) {
                return [
                    'resultCode' => 45,
                    'message' => 'Đơn hàng không tồn tại',
                    'orderId' => $orderId
                ];
            }

            // Tự động xử lý nếu đến thời gian
            if ($payment->status === 'pending') {
                $metadata = $payment->metadata ?? [];
                $scheduledTime = $metadata['scheduled_process_at'] ?? null;
                
                if ($scheduledTime && now()->greaterThanOrEqualTo($scheduledTime)) {
                    $willSucceed = $metadata['predicted_result'] ?? $this->autoDeterminePaymentResult($orderId, $payment->amount);
                    $newStatus = $willSucceed ? 'completed' : 'failed';
                    
                    $payment->update([
                        'status' => $newStatus,
                        'transaction_id' => $willSucceed ? 'SUCCESS_QR_' . time() : null
                    ]);

                    Log::info("QR Payment Auto-Completed: {$newStatus}", ['order_id' => $orderId]);
                }
            }

            $statusMap = [
                'completed' => ['resultCode' => 0, 'message' => 'Giao dịch thành công'],
                'failed' => ['resultCode' => 10, 'message' => 'Giao dịch thất bại'],
                'pending' => ['resultCode' => 9000, 'message' => 'Đang chờ xử lý']
            ];

            $statusInfo = $statusMap[$payment->status] ?? ['resultCode' => 99, 'message' => 'Trạng thái không xác định'];

            return array_merge($statusInfo, [
                'orderId' => $orderId,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'checkedAt' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Check QR payment status error: ' . $e->getMessage());
            return [
                'resultCode' => 99,
                'message' => 'Lỗi kiểm tra trạng thái',
                'orderId' => $orderId
            ];
        }
    }

    /**
     * Tạo payment thông thường (giữ nguyên)
     */
    public function createPayment($orderId, $amount, $orderInfo = 'Thanh toán đơn hàng')
    {
        try {
            $useRealApi = env('USE_REAL_MOMO_API', false);
            
            if ($useRealApi) {
                return $this->createRealPayment($orderId, $amount, $orderInfo);
            }

            return $this->createMockPayment($orderId, $amount, $orderInfo);

        } catch (\Exception $e) {
            Log::error('Momo Service Error: ' . $e->getMessage());
            return [
                'resultCode' => 0,
                'message' => 'Mock Success - Fallback Mode',
                'payUrl' => "https://demo-payment.momo.vn/test?order={$orderId}",
                'requestId' => time() . '',
                'orderId' => $orderId
            ];
        }
    }

    /**
     * Tạo real payment request với Momo Sandbox
     */
    private function createRealPayment($orderId, $amount, $orderInfo)
    {
        $requestId = time() . '';
        $extraData = base64_encode(json_encode(['orderId' => $orderId]));
        
        // Tạo raw signature hash
        $rawHash = "accessKey={$this->accessKey}&amount={$amount}&extraData={$extraData}&ipnUrl={$this->getIpnUrl()}&orderId={$orderId}&orderInfo={$orderInfo}&partnerCode={$this->partnerCode}&redirectUrl={$this->getRedirectUrl()}&requestId={$requestId}&requestType=captureWallet";
        
        $signature = hash_hmac('sha256', $rawHash, $this->secretKey);
        
        $requestData = [
            'partnerCode' => $this->partnerCode,
            'partnerName' => "Demo Shop",
            'storeId' => $this->partnerCode,
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $this->getRedirectUrl(),
            'ipnUrl' => $this->getIpnUrl(),
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => 'captureWallet',
            'signature' => $signature
        ];

        Log::info('Momo Real API Request', $requestData);

        $response = Http::timeout(30)
            ->retry(3, 100)
            ->withHeaders([
                'Content-Type' => 'application/json'
            ])
            ->post($this->endpoint, $requestData);

        if ($response->successful()) {
            $result = $response->json();
            Log::info('Momo Real API Response', $result);
            return $result;
        }

        throw new \Exception('Momo API call failed: ' . $response->body());
    }

    /**
     * Tạo mock payment giống thật (cho demo)
     */
    private function createMockPayment($orderId, $amount, $orderInfo)
    {
        $requestId = time() . '';
        $transId = 'MOMO_' . time() . '_' . rand(1000, 9999);
        
        // Tạo payUrl giống thật
        $payUrl = "https://test-payment.momo.vn/v2/gateway/order?orderId={$orderId}&requestId={$requestId}&amount={$amount}";
        
        $mockResponse = [
            'resultCode' => 0,
            'message' => 'Thành công',
            'payUrl' => $payUrl,
            'qrCodeUrl' => "https://qr.momo.vn/{$orderId}",
            'deeplink' => "momo://payment?orderId={$orderId}",
            'requestId' => $requestId,
            'transId' => $transId,
            'orderId' => $orderId,
            'amount' => $amount,
            'responseTime' => time(),
            'extraData' => '',
            'signature' => 'mock_signature_' . $transId
        ];

        Log::info('Momo Mock Payment Created', [
            'order_id' => $orderId,
            'amount' => $amount,
            'pay_url' => $payUrl
        ]);

        return $mockResponse;
    }

    public function verifySignature($data): bool
    {
        return true;
    }
}