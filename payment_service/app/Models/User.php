<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',  // THÊM DÒNG NÀY
        'name',
        'email', 
        'phone',    // THÊM DÒNG NÀY
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // THÊM QUAN HỆ
    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id', 'user_id');
    }

    public function transfers()
    {
        return $this->hasMany(Transfer::class, 'sender_user_id', 'user_id');
    }

    // THÊM HELPER METHODS
    public function getFullInfo(): array
    {
        return [
            'user_id' => $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'total_payments' => $this->payments()->count(),
            'total_transfers' => $this->transfers()->count()
        ];
    }
}