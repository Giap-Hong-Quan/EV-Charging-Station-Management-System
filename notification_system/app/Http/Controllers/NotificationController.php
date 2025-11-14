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

        $template = new NotificationTemplate();
        $template->name = $validated['name'];
        $template->content = $validated['content'];
        $template->save();

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

        $log = new NotificationLog();
        $log->template_id = $template->id;
        $log->receiver = $validated['receiver'];
        $log->status = 'sent';
        $log->message = $template->content;
        $log->type = 'notification';
        $log->save();

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
            $log = new NotificationLog();
            $log->template_id = null;
            $log->receiver = $validated['to'];
            $log->status = 'sent';
            $log->message = $validated['message'];
            $log->type = 'email';
            $log->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Email sent successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Mail send failed: ' . $e->getMessage());

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
                $content = str_replace("{{$key}}", $value, $content);
            }

            // Gửi email
            Mail::to($validated['to'])->send(
                new NotificationMail($template->name, $content)
            );

            // Lưu log
            $log = new NotificationLog();
            $log->template_id = $template->id;
            $log->receiver = $validated['to'];
            $log->status = 'sent';
            $log->message = $content;
            $log->subject = $template->name; // Lưu subject
            $log->template_variables = json_encode($validated['variables']); // Lưu biến đã dùng
            $log->type = 'email_template';
            $log->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Email sent successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Template mail send failed: ' . $e->getMessage());

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

            Log::info('💰 Payment notification received', $data);

            $notificationData = $data['data'];
            $templateName = $data['template'];

            // Gửi email template nếu có user_email
            if (isset($notificationData['user_email'])) {
                $this->sendPaymentTemplateEmail($notificationData, $templateName);
            }

            // Log payment notification
            $log = new NotificationLog();
            $log->template_id = null;
            $log->receiver = $notificationData['user_email'] ?? 'system';
            $log->status = 'sent';
            $log->message = "Payment notification: {$templateName}";
            $log->type = 'payment_notification';
            $log->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment notification processed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Payment notification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment notification'
            ], 500);
        }
    }

    /**
     * Gửi email template cho payment
     */
    protected function sendPaymentTemplateEmail(array $notificationData, string $templateName): void
    {
        try {
            // Chuẩn bị variables cho template
            $variables = [
                'amount' => $notificationData['amount'] ?? 'N/A',
                'transaction_id' => $notificationData['transaction_id'] ?? 'N/A',
                'order_id' => $notificationData['order_id'] ?? 'N/A',
                'reason' => $notificationData['reason'] ?? 'N/A'
            ];

            // Gửi email qua endpoint template có sẵn
            Http::post("http://127.0.0.1:8000/api/notifications/send-template-email", [
                'to' => $notificationData['user_email'],
                'template_name' => $templateName,
                'variables' => $variables
            ]);

            Log::info('Payment template email sent', [
                'to' => $notificationData['user_email'],
                'template' => $templateName
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send payment template email: ' . $e->getMessage());
        }
    }
}