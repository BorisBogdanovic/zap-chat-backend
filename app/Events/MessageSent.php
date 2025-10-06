<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public Message $message;
    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
       $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->to_id),
        ];
    }
     public function broadcastAs(): string
    {
        return 'MessageSentEvent';
    }

    public function broadcastWith()
    {
         return [
              'message'   => $this->message->message,
            'from_id'   => $this->message->from_id,
            'to_id'     => $this->message->to_id,
        ];
    }
}
