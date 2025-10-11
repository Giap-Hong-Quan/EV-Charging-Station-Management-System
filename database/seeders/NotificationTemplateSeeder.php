<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationTemplateSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('notification_templates')->insert([
            'type' => 'charging_complete',
            'subject' => 'Phiên sạc của bạn đã hoàn tất',
            'body' => '<p>Xin chào {{user_name}},<br>Phiên sạc tại <b>{{station_name}}</b> đã hoàn tất.<br>Tổng điện tiêu thụ: {{kwh}} kWh.</p>',
            'variables' => json_encode(['user_name', 'station_name', 'kwh']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}