<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Sửa enum payment_method để thêm 'momo'
            $table->enum('payment_method', ['momo', 'credit_card', 'bank_transfer', 'ewallet', 'cod'])
                  ->default('momo')
                  ->change();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('payment_method', ['credit_card', 'bank_transfer', 'ewallet', 'cod'])
                  ->default('credit_card')
                  ->change();
        });
    }
};