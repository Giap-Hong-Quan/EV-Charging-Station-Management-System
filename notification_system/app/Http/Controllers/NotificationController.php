<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\NotificationLog;
use App\Models\NotificationTemplate;
use App\Mail\NotificationMail;

class NotificationController extends Controller
{
    /**
     * Lấy danh sách log thông báo
     */
    public function index()
    {
        $logs = NotificationLog::latest()->get();
        return response()->json($logs);
    }

    /**
     * Tạo template thông báo mới
     */
    public function createTemplate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:notification_templates,name',
            'content' => 'required|string',
        ]);

        $template = NotificationTemplate::create([
            'name' => $validated['name'],
            'content' => $validated['content']
        ]);

        return response()->json($template);
    }

    /**
     * Gửi thông báo nội bộ (giả lập)
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:notification_templates,id',
            'receiver' => 'required|string',
        ]);

        $template = NotificationTemplate::find($validated['template_id']);

         $log = NotificationLog::create([
            'template_id' => $template->id,
            'receiver' => $validated['receiver'],
            'status' => 'sent',
            'message' => $template->content,
            'type' => 'notification',
        ]);

        return response()->json(['message' => 'Notification sent successfully']);
    }

    /**
     * Gửi email thật bằng Mailable class
     */
    public function sendEmail(Request $request)
    {
        $validated = $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        try {
            // Gửi mail bằng Mailable class
            Mail::to($validated['to'])->send(
                new NotificationMail($validated['subject'], $validated['message'])
            );

            // Lưu log gửi mail - SỬA CÁCH NÀY
            $log = NotificationLog::create([
                'template_id' => null,
                'receiver' => $validated['to'],
                'subject' => $validated['subject'],
                'status' => 'sent',
                'message' => $validated['message'],
                'type' => 'email',
                'template_variables' => null,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Email sent successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Mail send failed: ' . $e->getMessage());
             NotificationLog::create([
                'template_id' => null,
                'receiver' => $validated['to'],
                'subject' => $validated['subject'],
                'status' => 'failed',
                'message' => 'Failed: ' . $e->getMessage(),
                'type' => 'email',
                'template_variables' => null,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Mail sending failed: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Gửi email dùng template
     */
    public function sendTemplateEmail(Request $request)
    {
        $validated = $request->validate([
            'to' => 'required|email',
            'template_name' => 'required|string',
            'variables' => 'required|array'
        ]);

        try {
            // Tìm template
            $template = NotificationTemplate::where('name', $validated['template_name'])->first();
            
            if (!$template) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Template not found'
                ], 404);
            }

            // Thay thế variables trong content
            $content = $template->content;
            foreach ($validated['variables'] as $key => $value) {
                $content = str_replace("($key)", $value, $content);
            }

            // Gửi email
            Mail::to($validated['to'])->send(
                new NotificationMail($template->name, $content)
            );

            // Lưu log
            $log = NotificationLog::create([
                'template_id' => $template->id,
                'receiver' => $validated['to'],
                'subject' => $template->name,
                'status' => 'sent',
                'message' => $content,
                'template_variables' => json_encode($validated['variables']),
                'type' => 'email_template',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Email sent successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Template mail send failed: ' . $e->getMessage());
            NotificationLog::create([
                'template_id' => $template->id ?? null,
                'receiver' => $validated['to'],
                'subject' => $template->name ?? 'Unknown',
                'status' => 'failed',
                'message' => 'Failed: ' . $e->getMessage(),
                'template_variables' => json_encode($validated['variables']),
                'type' => 'email_template',
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Mail sending failed: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Xử lý payment notification từ payment service
     */
    public function sendPaymentNotification(Request $request)
    {
        try {
            $data = $request->validate([
                'type' => 'required|string',
                'data' => 'required|array',
                'template' => 'required|string'
            ]);

            Log::info('Payment notification received', $data);

            $notificationData = $data['data'];
            $templateName = $data['template'];

            // Gửi email template nếu có user_email
            if (isset($notificationData['user_email'])) {
                $this->sendPaymentTemplateEmail($notificationData, $templateName);
            }

            // Log payment notification
             $log = NotificationLog::create([
                'template_id' => null,
                'receiver' => $notificationData['user_email'] ?? 'system',
                'subject' => "Payment Notification: {$templateName}",
                'status' => 'sent',
                'message' => "Payment notification: {$templateName}",
                'type' => 'payment_notification',
                'template_variables' => json_encode($notificationData),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment notification processed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Payment notification error: ' . $e->getMessage());
            NotificationLog::create([
                'template_id' => null,
                'receiver' => $notificationData['user_email'] ?? 'system',
                'subject' => "Payment Notification Failed: {$templateName}",
                'status' => 'failed',
                'message' => 'Failed: ' . $e->getMessage(),
                'type' => 'payment_notification',
                'template_variables' => json_encode($notificationData ?? []),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment notification'
            ], 500);
        }
    }

     /**
     * Gửi SMS - THÊM METHOD MỚI ĐỂ KHỚP VỚI PAYMENT_SERVICE
     */
    public function sendSMS(Request $request)
    {
        try {
            $validated = $request->validate([
                'phone' => 'required|string',
                'message' => 'required|string',
                'template' => 'sometimes|string'
            ]);

            // Giả lập gửi SMS (trong thực tế sẽ tích hợp với SMS gateway)
            Log::info('SMS sent', [
                'phone' => $validated['phone'],
                'message' => $validated['message'],
                'template' => $validated['template'] ?? 'default'
            ]);

            // Lưu log SMS
            $log = NotificationLog::create([
                'template_id' => null,
                'receiver' => $validated['phone'],
                'subject' => 'SMS Notification',
                'status' => 'sent',
                'message' => $validated['message'],
                'type' => 'sms',
                'template_variables' => json_encode(['template' => $validated['template'] ?? 'default']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'SMS sent successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('SMS sending error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send SMS'
            ], 500);
        }
    }

    /**
     * Health check endpoint - THÊM METHOD MỚI
     */
    public function healthCheck()
    {
        return response()->json([
            'status' => 'healthy',
            'service' => 'Notification Service',
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Gửi email template cho payment
     */
    protected function sendPaymentTemplateEmail(array $notificationData, string $templateName): void
    {
        try {
            // Chuẩn bị variables cho template
            $variables = [
                'user_name' => $notificationData['user_name'] ?? 'Khách hàng',
                'amount' => $notificationData['amount'] ?? 'N/A',
                'transaction_id' => $notificationData['transaction_id'] ?? 'N/A',
                'order_id' => $notificationData['order_id'] ?? 'N/A',
                'reason' => $notificationData['reason'] ?? 'N/A',
                'station_name' => $notificationData['station_name'] ?? 'N/A',
                'booking_code' => $notificationData['booking_code'] ?? 'N/A',
                'login_time' => $notificationData['login_time'] ?? now()->format('H:i d/m/Y'),
            ];

            // Gửi request nội bộ
            $this->sendTemplateEmail(new Request([
                'to' => $notificationData['user_email'],
                'template_name' => $templateName,
                'variables' => $variables
            ]));

            Log::info('Payment template email sent', [
                'to' => $notificationData['user_email'],
                'template' => $templateName
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send payment template email: ' . $e->getMessage());
            throw $e;
        }
    }
}