<?php

namespace App\Service;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.notification.url', 'http://localhost:8000');
    }

    public function sendPaymentNotification(array $notificationData)
    {
        try {
            $response = Http::timeout(10)
                ->post("{$this->baseUrl}/api/notifications/payment", [
                    'type' => 'payment',
                    'data' => $notificationData,
                    'template' => $this->getPaymentTemplate($notificationData['status'] ?? 'pending')
                ]);

            if ($response->successful()) {
                Log::info('Payment notification sent successfully', [
                    'order_id' => $notificationData['order_id'] ?? null,
                    'status' => $notificationData['status'] ?? null
                ]);
                return $response->json();
            }

            Log::warning('Failed to send payment notification', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            return null;

        } catch (\Exception $e) {
            Log::error('Notification service error: ' . $e->getMessage(), [
                'order_id' => $notificationData['order_id'] ?? null
            ]);
            return null;
        }
    }

    protected function getPaymentTemplate(string $status): string
    {
        return match($status) {
            'completed' => 'payment_success',
            'failed' => 'payment_failed',
            'refunded' => 'payment_refunded',
            default => 'payment_pending',
        };
    }
}