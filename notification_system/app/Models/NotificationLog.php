<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    protected $fillable = [
        'template_id',
        'receiver', 
        'status',
        'message',
        'type'
    ];

    // THÊM QUAN HỆ VỚI TEMPLATE
    public function template(): BelongsTo
    {
        return $this->belongsTo(NotificationTemplate::class, 'template_id');
    }

}