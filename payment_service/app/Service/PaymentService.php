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
                'user_email' => $payment->user_email,
                'amount' => $payment->amount,
                'payment_method' => $payment->payment_method,
                'status' => 'pending'
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
            $isSuccess = $this->mockPaymentProcessing($payment, $transactionData);

            if ($isSuccess) {
                $payment->update([
                    'status' => 'completed',
                    'payment_gateway' => $transactionData['gateway'] ?? 'mock_gateway',
                ]);

                $this->notificationService->sendPaymentNotification([
                    'order_id' => $payment->order_id,
                    'user_email' => $payment->user_email,
                    'amount' => $payment->amount,
                    'status' => 'completed',
                    'transaction_id' => $payment->transaction_id
                ]);

                Log::info('Payment processed successfully', ['payment_id' => $payment->id]);
            } else {
                $payment->update(['status' => 'failed']);

                $this->notificationService->sendPaymentNotification([
                    'order_id' => $payment->order_id,
                    'user_email' => $payment->user_email,
                    'amount' => $payment->amount,
                    'status' => 'failed',
                    'reason' => 'Payment processing failed'
                ]);

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

            $this->notificationService->sendPaymentNotification([
                'order_id' => $payment->order_id,
                'user_email' => $payment->user_email,
                'amount' => $payment->amount,
                'status' => 'refunded',
                'reason' => $reason
            ]);

            Log::info('Payment refunded', ['payment_id' => $payment->id, 'reason' => $reason]);

            return $payment->fresh();
        });
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