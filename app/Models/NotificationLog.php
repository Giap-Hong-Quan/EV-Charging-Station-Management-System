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
}