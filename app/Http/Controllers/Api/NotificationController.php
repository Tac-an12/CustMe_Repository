<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\Request as ModelsRequest;
use App\Events\NotificationEvent;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Fetch notifications with associated requests, posts, users, and roles
        $notifications = Notification::with([
            'request.post',
            'request.user.role',       // Load role of the user who created the request
            'request.targetUser.role',  // Load role of the target user
        ])
            ->where('user_id', $request->user()->id) // Filter by the authenticated user
            ->orderBy('created_at', 'desc') // Order by creation date
            ->get();

        // Transform the notifications to replace the status and include user roles
        $notifications = $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'content' => $notification->content,
                'status' => $notification->request->status ?? 'N/A', // Replace with the status from the associated request
                'timestamp' => $notification->timestamp,
                'user_id' => $notification->user_id,
                'request_id' => $notification->request_id,
                'created_at' => $notification->created_at,
                'updated_at' => $notification->updated_at,
                'target_user_id' => $notification->request->target_user_id ?? 'N/A',
                'price' => $notification->request->post->price ?? 'N/A',
                'request_content' => $notification->request->request_content,
                'duration_days' => $notification->request->duration_days,
                'duration_minutes' => $notification->request->duration_minutes,

                // Include the roles of the user and target user
                'user_role' => $notification->request->user->role->roleid ?? 'N/A', // Role of the request initiator
                'target_user_role' => $notification->request->targetUser->role->roleid ?? 'N/A', // Role of the target user
            ];
        });
        broadcast(new NotificationEvent($notifications));
        // Return the transformed data as a JSON response
        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
