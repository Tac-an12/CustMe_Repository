<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timer extends Model
{
    use HasFactory;
    protected $primaryKey = 'timer_id';
    protected $fillable = ['request_id', 'start_time', 'deadline', 'duration_days', 'duration_minutes'];

    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }
}
