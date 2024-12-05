<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceRequest extends Model
{
    protected $table = 'balance_requests';

    // Define the fillable fields
    protected $fillable = [
        'user_id',
        'amount',
        'status'
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
