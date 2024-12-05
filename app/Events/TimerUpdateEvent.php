<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TimerUpdateEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public $requestId;
    public $remainingTime;

    /**
     * Create a new event instance.
     */
    public function __construct($requestId, $remainingTime)
    {
        $this->requestId = $requestId;
        $this->remainingTime = $remainingTime;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('timer-channel-' . $this->requestId);
    }

    public function broadcastWith()
    {
        return [
            'remaining_time' => $this->remainingTime
        ];
    }
}
