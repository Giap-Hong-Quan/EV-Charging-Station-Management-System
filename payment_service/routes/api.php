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

// Payment routes
Route::prefix('payments')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);
    Route::post('/', [PaymentController::class, 'create']);
    Route::post('/momo', [PaymentController::class, 'createWithMomo']);
    Route::post('/qr/create', [PaymentController::class, 'createQRPayment']); // THÊM QR PAYMENT
    Route::get('/qr-status/{orderId}', [PaymentController::class, 'checkQRPaymentStatus']); // THÊM CHECK STATUS
    Route::get('/{paymentId}', [PaymentController::class, 'show']);
    Route::get('/order/{orderId}', [PaymentController::class, 'getByOrderId']);
    
    // Stats
    Route::get('/stats/summary', [PaymentController::class, 'getStats']);
});

// User payments
Route::get('/users/{userId}/payments', [PaymentController::class, 'getUserPayments']);

// Momo webhooks
Route::post('/momo/ipn', [PaymentController::class, 'momoIpn']);
Route::get('/payment/success', [PaymentController::class, 'paymentSuccess']);
