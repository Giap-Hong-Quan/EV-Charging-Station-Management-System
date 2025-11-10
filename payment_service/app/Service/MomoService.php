<?php

namespace App\Service;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MomoService
{
    private $partnerCode;
    private $accessKey;
    private $secretKey;
    private $endpoint;

    public function __construct()
    {
        $this->partnerCode = env('MOMO_PARTNER_CODE', 'MOMOIQA420180417');
        $this->accessKey = env('MOMO_ACCESS_KEY', 'QNGQSuqSJN3keRjW');
        $this->secretKey = env('MOMO_SECRET_KEY', 'ahM2hK5HPfXXb3cO9ZJcFf7xMal4V8qP');
        $this->endpoint = env('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create');
    }

    public function createPayment($orderId, $amount, $orderInfo = 'Thanh toán đơn hàng')
    {
        try {
            // MOCK RESPONSE - KHÔNG CẦN CHỮ KÝ
            $mockResponse = [
                'resultCode' => 0,
                'message' => 'Success',
                'payUrl' => 'https://test-payment.momo.vn/v2/gateway/test?orderId=' . $orderId,
                'requestId' => time() . '',
                'transId' => 'TEST_' . time(),
                'orderId' => $orderId,
                'amount' => $amount,
                'responseTime' => time(),
                'extraData' => '',
                'signature' => 'mock_signature_' . time()
            ];

            Log::info('Momo Mock Response (no signature required)', $mockResponse);

            return $mockResponse;

        } catch (\Exception $e) {
            Log::error('Momo Service Error: ' . $e->getMessage());
            
            // Fallback mock response
            return [
                'resultCode' => 0,
                'message' => 'Mock Success',
                'payUrl' => 'https://example.com/momo-test?order=' . $orderId,
                'requestId' => time() . ''
            ];
        }
    }

    public function verifySignature($data)
    {
        // Mock verify - luôn return true
        Log::info('Mock signature verification', ['data' => $data]);
        return true;
    }

    public function checkPaymentStatus($orderId)
    {
        // Mock payment status
        return [
            'resultCode' => 0,
            'message' => 'Success',
            'transId' => 'TEST_' . time(),
            'amount' => 20000,
            'status' => 'completed'
        ];
    }
}