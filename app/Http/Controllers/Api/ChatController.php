<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Events\MessageSent;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getMessages(Request $request)
    {

        $userId = Auth::id();
        $chats = Chat::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with('sender', 'receiver') // Load sender and receiver relationships
            ->get();

        return response()->json($chats);
    }


    public function getUserChatList(Request $request)
    {
        $userId = Auth::id();

        // Get all unique user IDs the current user has chatted with
        $chattedUserIds = Chat::where('sender_id', $userId)
            ->pluck('receiver_id') // Get the IDs of users the current user sent messages to
            ->merge(Chat::where('receiver_id', $userId)->pluck('sender_id')) // Get the IDs of users who sent messages to the current user
            ->unique(); // Ensure the IDs are unique

        // Fetch the user details for all the unique IDs
        $users = User::whereIn('id', $chattedUserIds)->get();

        return response()->json($users);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'receiver_id' => 'required|exists:users,id',
        ]);

        $startTime = microtime(true); // Start time
        $chat = Chat::create([
            'content' => $request->input('content'),
            'sender_id' => Auth::id(),
            'receiver_id' => $request->input('receiver_id'),
        ]);

        // Broadcast the message event
        broadcast(new MessageSent($chat))->toOthers();

        $endTime = microtime(true); // End time
        Log::info('Message sent on: ' . (($endTime - $startTime) * 1000) . ' ms'); // Log the time taken

        return response()->json($chat, 201);
    }
}
