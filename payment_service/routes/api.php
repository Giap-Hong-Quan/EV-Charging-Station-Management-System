<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'service' => 'payment_service',
        'timestamp' => now()->toISOString()
    ]);
});

// Momo Payment Routes
Route::post('/payments/momo', [PaymentController::class, 'createWithMomo']);
Route::post('/momo/ipn', [PaymentController::class, 'momoIpn']);
Route::get('/payment/success', [PaymentController::class, 'paymentSuccess']);

// Existing routes
Route::prefix('payments')->group(function () {
    Route::post('/', [PaymentController::class, 'create']);
    Route::get('/{paymentId}', [PaymentController::class, 'show']);
    Route::post('/{paymentId}/process', [PaymentController::class, 'process']);
});

Route::get('/users/{userId}/payments', [PaymentController::class, 'getUserPayments']);