<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationLog extends Model
{
    protected $fillable = [
        'template_id',
        'receiver', 
        'subject',
        'status',
        'message',
        'template_variables',
        'type'
    ];

    protected $casts = [
        'template_variables' => 'array',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(NotificationTemplate::class, 'template_id');
    }
}