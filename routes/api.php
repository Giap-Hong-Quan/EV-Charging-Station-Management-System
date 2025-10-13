<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Đây là nơi bạn có thể đăng ký các route API cho ứng dụng của bạn.
| Các route này sẽ được load bởi RouteServiceProvider trong nhóm middleware "api".
|
*/

Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/notifications/send', [NotificationController::class, 'send']);
Route::post('/notifications/templates', [NotificationController::class, 'createTemplate']);