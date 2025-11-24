<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\EmailVerificationController;

Route::middleware('api')->group(function () {
    // Health check
    Route::get('/up', [NotificationController::class, 'healthCheck']);
    
    // Email endpoints
    Route::post('/send-mail', [NotificationController::class, 'sendEmail']);
    Route::post('/send-template-email', [NotificationController::class, 'sendTemplateEmail']);
    
    // SMS endpoint
    Route::post('/notifications/sms', [NotificationController::class, 'sendSMS']);
    
    // Notification management
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/send', [NotificationController::class, 'send']);
    Route::post('/notifications/templates', [NotificationController::class, 'createTemplate']);
    
    // Payment integration
    Route::post('/notifications/payment', [NotificationController::class, 'sendPaymentNotification']);

    // Email verification
    Route::post('/email-verification/send', [EmailVerificationController::class, 'sendVerificationCode']);
    Route::post('/email-verification/verify', [EmailVerificationController::class, 'verifyCode']);
    Route::post('/email-verification/resend', [EmailVerificationController::class, 'resendCode']);
});