<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            
            // Thêm các trường mới vào đây
            $table->string('order_id')->unique();
            $table->string('user_id');
            $table->string('user_email');
            $table->decimal('amount', 15, 2);
            $table->string('currency')->default('VND');
            $table->enum('payment_method', ['credit_card', 'bank_transfer', 'ewallet', 'cod']);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->string('payment_gateway')->nullable();
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            
            $table->timestamps();

            // Thêm indexes để tối ưu performance
            $table->index(['user_id', 'status']);
            $table->index('order_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};