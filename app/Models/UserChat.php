<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserChat extends Model
{
    protected $fillable = ['user_id', 'chat_id'];

    public function chat()
    {
        return $this->belongsTo(Chat::class, 'chat_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function linkUserToChat($userId, $chatId)
    {
        return self::create([
            'user_id' => $userId,
            'chat_id' => $chatId,
        ]);
    }
}