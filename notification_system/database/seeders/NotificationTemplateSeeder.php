<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationTemplateSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('notification_templates')->insert([
            'name' => 'charging_complete',
            'content' => '<p>Xin chào {{user_name}},<br>Phiên sạc tại <b>{{station_name}}</b> đã hoàn tất.<br>Tổng điện tiêu thụ: {{kwh}} kWh.</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Có thể thêm các template khác
        DB::table('notification_templates')->insert([
            'name' => 'charging_started',
            'content' => '<p>Xin chào {{user_name}},<br>Phiên sạc tại <b>{{station_name}}</b> đã bắt đầu.</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('notification_templates')->insert([
            'name' => 'low_balance',
            'content' => '<p>Xin chào {{user_name}},<br>Số dư tài khoản của bạn sắp hết. Vui lòng nạp thêm tiền.</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}