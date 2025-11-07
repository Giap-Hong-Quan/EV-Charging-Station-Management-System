<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // Thêm cấu hình cho notification service
    'notification' => [
        'url' => env('NOTIFICATION_SERVICE_URL', 'http://localhost:3001'),
        'timeout' => env('NOTIFICATION_SERVICE_TIMEOUT', 10),
        'retry_attempts' => env('NOTIFICATION_RETRY_ATTEMPTS', 3),
        'retry_delay' => env('NOTIFICATION_RETRY_DELAY', 100),
    ],

    // Có thể thêm các payment gateways sau này
    'vnpay' => [
        'url' => env('VNPAY_URL'),
        'tmn_code' => env('VNPAY_TMN_CODE'),
        'hash_secret' => env('VNPAY_HASH_SECRET'),
    ],

    'momo' => [
        'url' => env('MOMO_URL'),
        'partner_code' => env('MOMO_PARTNER_CODE'),
        'access_key' => env('MOMO_ACCESS_KEY'),
        'secret_key' => env('MOMO_SECRET_KEY'),
    ],

];