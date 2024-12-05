<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str; // Import the Str class

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'amount', 'qr_code_url', 'status', 'transaction_id'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            $payment->transaction_id = self::generateUniqueTransactionId();
        });
    }

    private static function generateUniqueTransactionId()
    {
        do {
            $transactionId = Str::upper(Str::random(10)); // Generates a 10-character random string
        } while (self::where('transaction_id', $transactionId)->exists());
        return $transactionId;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
