<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->nullable()->constrained('notification_templates')->onDelete('cascade');
            $table->string('receiver'); // Thay email bằng receiver
            $table->string('status');
            $table->text('message'); // Thay content bằng message
            $table->string('type');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
    }
};