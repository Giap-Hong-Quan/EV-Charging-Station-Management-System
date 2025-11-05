<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

Route::get('/', function () {
    return view('welcome');
});

Route::withoutMiddleware(['web'])->group(function () {
    Route::post('/send-mail', [NotificationController::class, 'sendEmail']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/send', [NotificationController::class, 'send']);
    Route::post('/notifications/templates', [NotificationController::class, 'createTemplate']);
    Route::post('/send-template-mail', [NotificationController::class, 'sendTemplateEmail']);
});