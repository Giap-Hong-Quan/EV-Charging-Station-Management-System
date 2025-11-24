<?php

namespace App\Service;

use App\Models\Payment;
use App\Models\Transfer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected $notificationService;
    protected $momoService;

    public function __construct(
        NotificationService $notificationService,
        MomoService $momoService
    ) {
        $this->notificationService = $notificationService;
        $this->momoService = $momoService;
    }

    /**
     * Tạo payment record mới
     */
    public function createPayment(array $paymentData): Payment
    {
        return DB::transaction(function () use ($paymentData) {
            $payment = Payment::create([
                'order_id' => $paymentData['order_id'],
                'user_id' => $paymentData['user_id'],
                'user_email' => $paymentData['user_email'],
                'user_name' => $paymentData['user_name'] ?? 'Khách hàng',
                'amount' => $paymentData['amount'],
                'currency' => $paymentData['currency'] ?? 'VND',
                'payment_method' => $paymentData['payment_method'],
                'description' => $paymentData['description'] ?? null,
                'metadata' => $paymentData['metadata'] ?? [],
            ]);

            Log::info('Payment created successfully', [
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id
            ]);

            return $payment;
        });
    }

    /**
     * Gửi notifications khi payment thành công
     */
    protected function sendSuccessNotifications(Payment $payment): void
    {
        $this->notificationService->sendPaymentNotification([
            'order_id' => $payment->order_id,
            'user_id' => $payment->user_id,
            'user_email' => $payment->user_email,
            'user_name' => $payment->user_name,
            'amount' => $payment->amount,
            'status' => 'completed',
            'transaction_id' => $payment->transaction_id,
            'action' => 'completed'
        ]);
    }

    /**
     * Gửi notifications khi payment thất bại
     */
    protected function sendFailedNotifications(Payment $payment): void
    {
        $this->notificationService->sendPaymentNotification([
            'order_id' => $payment->order_id,
            'user_id' => $payment->user_id,
            'user_email' => $payment->user_email,
            'user_name' => $payment->user_name,
            'amount' => $payment->amount,
            'status' => 'failed',
            'action' => 'failed'
        ]);
    }

    /**
     * Lấy danh sách payments của user
     */
    public function getUserPayments(string $userId)
    {
        return Payment::forUser($userId)
            ->recent()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Tìm payment bằng order_id
     */
    public function getPaymentByOrderId(string $orderId): ?Payment
    {
        return Payment::where('order_id', $orderId)->first();
    }

    /**
     * Lấy thống kê payments
     */
    public function getPaymentStats(): array
    {
        $total = Payment::count();
        $completed = Payment::completed()->count();
        $pending = Payment::pending()->count();
        $failed = Payment::failed()->count();
        $totalAmount = Payment::completed()->sum('amount');

        return [
            'total_payments' => $total,
            'completed_payments' => $completed,
            'pending_payments' => $pending,
            'failed_payments' => $failed,
            'success_rate' => $total > 0 ? round(($completed / $total) * 100, 2) : 0,
            'total_revenue' => $totalAmount,
            'revenue_formatted' => number_format($totalAmount) . ' VND'
        ];
    }
}