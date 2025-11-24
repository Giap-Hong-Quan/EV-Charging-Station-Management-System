<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique();
            $table->string('user_id');
            $table->string('user_email');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('VND');
            $table->enum('payment_method', ['momo', 'momo_qr', 'credit_card', 'bank_transfer', 'ewallet', 'cod'])->default('momo'); //momo_qr
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->string('payment_gateway')->nullable();
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['status']);
            $table->index(['order_id']);
            $table->index(['created_at']);
            $table->index(['transaction_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};