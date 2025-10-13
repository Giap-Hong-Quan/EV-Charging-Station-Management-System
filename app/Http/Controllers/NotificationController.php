<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NotificationLog;
use App\Models\NotificationTemplate;

class NotificationController extends Controller
{
    // Gửi thông báo (giả lập)
    public function send(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:notification_templates,id',
            'receiver' => 'required|string',
        ]);

        $template = NotificationTemplate::find($validated['template_id']);

        // Giả lập gửi thông báo
        NotificationLog::create([
            'template_id' => $template->id,
            'receiver' => $validated['receiver'],
            'status' => 'sent',
            'message' => $template->content,
        ]);

        return response()->json(['message' => 'Notification sent successfully']);
    }

    // Xem danh sách thông báo
    public function index()
    {
        $logs = NotificationLog::latest()->get();
        return response()->json($logs);
    }

    // Tạo template mới
    public function createTemplate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:notification_templates,name',
            'content' => 'required|string',
        ]);

        $template = NotificationTemplate::create($validated);
        return response()->json($template);
    }
}