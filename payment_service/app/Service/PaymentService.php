<?php

namespace App\Service;

use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected $notificationService;

    public function __construct()
    {
        $this->notificationService = new NotificationService();
    }

    public function createPayment(array $paymentData): Payment
    {
        return DB::transaction(function () use ($paymentData) {
            $payment = Payment::create([
                'order_id' => $paymentData['order_id'],
                'user_id' => $paymentData['user_id'],
                'user_email' => $paymentData['user_email'],
                'amount' => $paymentData['amount'],
                'currency' => $paymentData['currency'] ?? 'VND',
                'payment_method' => $paymentData['payment_method'],
                'description' => $paymentData['description'] ?? null,
                'metadata' => $paymentData['metadata'] ?? [],
            ]);

            // Send initial notification
            $this->notificationService->sendPaymentNotification([
                'order_id' => $payment->order_id,
                'user_id' => $payment->user_id,
                'user_email' => $payment->user_email,
                'amount' => $payment->amount,
                'payment_method' => $payment->payment_method,
                'status' => 'pending',
                'action' => 'created'
            ]);

            Log::info('Payment created successfully', ['payment_id' => $payment->id]);

            return $payment;
        });
    }

    public function processPayment(int $paymentId, array $transactionData): Payment
    {
        return DB::transaction(function () use ($paymentId, $transactionData) {
            $payment = Payment::findOrFail($paymentId);

            // Update to processing status
            $payment->update([
                'status' => 'processing',
                'transaction_id' => $transactionData['transaction_id'] ?? null,
            ]);

            // Simulate payment processing
            $isSuccess = rand(0, 100) > 20;

            if ($isSuccess) {
                $payment->update([
                    'status' => 'completed',
                    'payment_gateway' => $transactionData['gateway'] ?? 'mock_gateway',
                ]);
                // GỬI NOTIFICATION & EMAIL THÀNH CÔNG
                $this->sendSuccessNotifications($payment);

                Log::info('Payment processed successfully', ['payment_id' => $payment->id]);
            } else {
                $payment->update(['status' => 'failed']);
                // GỬI NOTIFICATION & EMAIL THẤT BẠI
                $this->sendFailedNotifications($payment);

                Log::warning('Payment processing failed', ['payment_id' => $payment->id]);
            }

            return $payment->fresh();
        });
    }

    public function refundPayment(int $paymentId, string $reason): Payment
    {
        return DB::transaction(function () use ($paymentId, $reason) {
            $payment = Payment::findOrFail($paymentId);

            if (!$payment->canBeRefunded()) {
                throw new \Exception('Only completed payments can be refunded');
            }

            $payment->update([
                'status' => 'refunded',
                'metadata' => array_merge($payment->metadata ?? [], [
                    'refund_reason' => $reason,
                    'refunded_at' => now()->toISOString()
                ])
            ]);

            // GỬI NOTIFICATION HOÀN TIỀN
            $this->notificationService->sendPaymentNotification([
                'order_id' => $payment->order_id,
                'user_id' => $payment->user_id,
                'user_email' => $payment->user_email,
                'amount' => $payment->amount,
                'status' => 'refunded',
                'reason' => $reason,
                'action' => 'refunded'
            ]);

            // GỬI EMAIL HOÀN TIỀN
            $this->notificationService->sendEmail([
                'to' => $payment->user_email,
                'subject' => 'Hoàn tiền thành công - ' . $payment->order_id,
                'template' => 'payment-refund',
                'data' => [
                    'order_id' => $payment->order_id,
                    'amount' => $payment->amount,
                    'reason' => $reason,
                    'refunded_at' => now()->format('d/m/Y H:i')
                ]
            ]);

            Log::info('Payment refunded', ['payment_id' => $payment->id, 'reason' => $reason]);

            return $payment->fresh();
        });
    }

    protected function sendSuccessNotifications(Payment $payment): void
    {
        // Gửi payment notification
        $this->notificationService->sendPaymentNotification([
            'order_id' => $payment->order_id,
            'user_id' => $payment->user_id,
            'user_email' => $payment->user_email,
            'amount' => $payment->amount,
            'status' => 'completed',
            'transaction_id' => $payment->transaction_id,
            'action' => 'completed'
        ]);

        // Gửi email
        $this->notificationService->sendEmail([
            'to' => $payment->user_email,
            'subject' => 'Thanh toán thành công - ' . $payment->order_id,
            'template' => 'payment-success',
            'data' => [
                'order_id' => $payment->order_id,
                'amount' => number_format($payment->amount) . ' VND',
                'payment_method' => $payment->payment_method,
                'transaction_id' => $payment->transaction_id,
                'paid_at' => $payment->updated_at->format('d/m/Y H:i')
            ]
        ]);
    }

    protected function sendFailedNotifications(Payment $payment): void
    {
        $this->notificationService->sendPaymentNotification([
            'order_id' => $payment->order_id,
            'user_id' => $payment->user_id,
            'user_email' => $payment->user_email,
            'amount' => $payment->amount,
            'status' => 'failed',
            'action' => 'failed'
        ]);

        $this->notificationService->sendEmail([
            'to' => $payment->user_email,
            'subject' => 'Thanh toán thất bại - ' . $payment->order_id,
            'template' => 'payment-failed',
            'data' => [
                'order_id' => $payment->order_id,
                'amount' => number_format($payment->amount) . ' VND',
                'payment_method' => $payment->payment_method
            ]
        ]);
    }

    protected function mockPaymentProcessing(Payment $payment, array $transactionData): bool
    {
        // Mock payment gateway processing
        // In real implementation, integrate with VNPay, Momo, Stripe, etc.
        return rand(0, 100) > 20; // 80% success rate
    }

    public function getUserPayments(string $userId)
    {
        return Payment::forUser($userId)
            ->recent()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getPaymentByOrderId(string $orderId): ?Payment
    {
        return Payment::where('order_id', $orderId)->first();
    }
}