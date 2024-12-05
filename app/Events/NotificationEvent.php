<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Log;

class NotificationEvent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $notification;

    public function __construct($notification)
    {
        Log::info('Notification Event Data: ', (array) $notification);
        $this->notification = $notification;
    }

    public function broadcastOn()
    {
        return new Channel('notifications');
    }

    public function broadcastAs()
    {
        return 'new-notification';
    }
}
