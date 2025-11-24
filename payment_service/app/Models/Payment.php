<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id', 
        'user_email',
        'user_name',
        'amount',
        'currency',
        'payment_method',
        'status',
        'transaction_id',
        'payment_gateway',
        'description',
        'metadata'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Scope for pending payments
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for completed payments
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope for failed payments
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope for refunded payments
     */
    public function scopeRefunded($query)
    {
        return $query->where('status', 'refunded');
    }

    /**
     * Scope for user's payments
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for recent payments
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Check if payment is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if payment is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if payment can be refunded
     */
    public function canBeRefunded(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Get formatted amount with currency
     */
    public function getFormattedAmount(): string
    {
        return number_format($this->amount) . ' ' . $this->currency;
    }

    /**
     * Get payment status in Vietnamese
     */
    public function getStatusVietnamese(): string
    {
        return match($this->status) {
            'pending' => 'Đang chờ',
            'processing' => 'Đang xử lý',
            'completed' => 'Thành công',
            'failed' => 'Thất bại',
            'refunded' => 'Đã hoàn tiền',
            'cancelled' => 'Đã hủy',
            default => 'Không xác định'
        };
    }

    public function getUserInfo(): array
    {
        return [
            'user_id' => $this->user_id,
            'user_email' => $this->user_email,
            'user_name' => $this->user_name ?? 'Khách hàng',
        ];
    }
}