<?php

namespace App\Service;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected $baseUrl;
    protected $timeout;
    protected $retryAttempts;


    public function __construct()
    {
        $this->baseUrl = config('services.notification.url');
        $this->timeout = config('services.notification.timeout', 10);
        $this->retryAttempts = config('services.notification.retry_attempts', 3);
    }

    public function sendPaymentNotification(array $notificationData)
    {
        try {
            $response = Http::timeout($this->timeout)
                ->retry($this->retryAttempts, 100)
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

     /**
     * Gửi email qua notification service
     */
    public function sendEmail(array $emailData)
    {
        try {
            $response = Http::timeout($this->timeout)
                ->retry($this->retryAttempts, 100)
                ->post("{$this->baseUrl}/api/send-template-email", [
                    'to' => $emailData['to'],
                    'subject' => $emailData['subject'],
                    'template' => $emailData['template'] ?? 'payment-success',
                    'data' => $emailData['data'] ?? []
                ]);

            if ($response->successful()) {
                Log::info('Email sent via notification service', [
                    'to' => $emailData['to'],
                    'subject' => $emailData['subject'],
                    'template' => $emailData['template'] ?? 'payment-success',
                ]);
                return $response->json();
            }

            Log::warning('Failed to send email via notification service', [
                'status' => $response->status()
            ]);
            return null;

        } catch (\Exception $e) {
            Log::error('Email service error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Gửi SMS qua notification service
     */
    public function sendSMS(array $smsData)
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/api/notifications/sms", [
                    'phone' => $smsData['phone'],
                    'message' => $smsData['message'],
                    'template' => $smsData['template'] ?? 'payment-alert'
                ]);

            if ($response->successful()) {
                Log::info('SMS sent via notification service', [
                    'phone' => $smsData['phone']
                ]);
                return $response->json();
            }

            return null;

        } catch (\Exception $e) {
            Log::error('SMS service error: ' . $e->getMessage());
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