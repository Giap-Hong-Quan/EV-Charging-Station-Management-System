<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

Route::middleware('api')->group(function () {
    Route::post('/send-mail', [NotificationController::class, 'sendEmail']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/send', [NotificationController::class, 'send']);
    Route::post('/notifications/templates', [NotificationController::class, 'createTemplate']);
});