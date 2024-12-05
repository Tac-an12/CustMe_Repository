<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'file_path', 'sender_id', 'receiver_id'];

    // Create a new chat message
    public static function createMessage($content, $file = null, $senderId, $receiverId)
    {
        $filePath = null;

        if ($file) {
            $filePath = $file->store('chat_files', 'public');
        }

        return self::create([
            'content' => $content,
            'file_path' => $filePath,
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
        ]);
    }

    public static function getMessagesBetweenUsers($user1Id, $user2Id)
    {
        return self::where(function ($query) use ($user1Id, $user2Id) {
            $query->where('sender_id', $user1Id)
                ->where('receiver_id', $user2Id);
        })->orWhere(function ($query) use ($user1Id, $user2Id) {
            $query->where('sender_id', $user2Id)
                ->where('receiver_id', $user1Id);
        })->with(['sender', 'receiver'])->get();
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
