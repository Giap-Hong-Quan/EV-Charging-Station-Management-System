<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\EmailVerification;
use App\Models\NotificationLog;
use App\Mail\NotificationMail;

class EmailVerificationController extends Controller
{
    /**
     * Gửi mã xác thực email
     */
    public function sendVerificationCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        try {
            $email = $validated['email'];
            
            // Tạo mã xác thực 6 chữ số
            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Thời gian hết hạn: 1 phút
            $expiresAt = Carbon::now()->addMinutes(1);

            // Xóa các mã cũ của email này
            EmailVerification::where('email', $email)->delete();

            // Lưu mã xác thực
            EmailVerification::create([
                'email' => $email,
                'verification_code' => $verificationCode,
                'expires_at' => $expiresAt,
            ]);

            $emailContent = "Mã xác thực email của bạn là: **$verificationCode**. \n\nMã có hiệu lực trong 1 phút.";

            // Gửi email chứa mã OTP
            Mail::to($email)->send(
                new NotificationMail('Mã xác thực email', $emailContent)
            );

            NotificationLog::create([
                'template_id' => null,
                'receiver' => $email,
                'subject' => 'Mã xác thực email',
                'status' => 'sent',
                'message' => $emailContent,
                'type' => 'email_verification',
                'template_variables' => json_encode(['verification_code' => $verificationCode]),
            ]);

            Log::info('Verification code sent', [
                'email' => $email,
                'code' => $verificationCode
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Mã xác thực đã được gửi đến email của bạn.',
                'expires_at' => $expiresAt->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Send verification code failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gửi mã xác thực thất bại. Vui lòng thử lại.'
            ], 500);
        }
    }

    /**
     * Xác thực mã OTP
     */
    public function verifyCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'verification_code' => 'required|string|size:6'
        ]);

        try {
            $email = $validated['email'];
            $code = $validated['verification_code'];

            // Tìm mã xác thực hợp lệ
            $verification = EmailVerification::where('email', $email)
                ->where('verification_code', $code)
                ->where('is_used', false)
                ->where('expires_at', '>', Carbon::now())
                ->latest()
                ->first();

            if (!$verification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã xác thực không hợp lệ hoặc đã hết hạn.'
                ], 400);
            }

            // Đánh dấu mã đã sử dụng
            $verification->update(['is_used' => true]);

            Log::info('Email verified successfully', ['email' => $email]);

            return response()->json([
                'success' => true,
                'message' => 'Xác thực email thành công!'
            ]);

        } catch (\Exception $e) {
            Log::error('Verify code failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Xác thực thất bại. Vui lòng thử lại.'
            ], 500);
        }
    }

    /**
     * Gửi lại mã xác thực
     */
    public function resendCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        // Vô hiệu hóa các mã cũ của email này
        EmailVerification::where('email', $validated['email'])
            ->where('is_used', false)
            ->update(['is_used' => true]);

        // Gửi mã mới
        return $this->sendVerificationCode($request);
    }
}