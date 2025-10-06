<?php

namespace App\Services;

use App\Models\Message;
use App\Events\MessageSent;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatService
{
//////////////////////////////////////////////////////////////////////////////GET MESSAGES SERVICE
public function send(int $fromId,int $toId,string $messageText):Message
{
    $message = Message::create([
        'from_id' => $fromId,
        'to_id'   => $toId,
        'message' => $messageText,
        'read_at' => null,
    ]);

    event(new MessageSent($message));

     return $message->load('from:id,name,image_path', 'to:id,name,image_path');
}
//////////////////////////////////////////////////////////////////////////////SEND MESSAGES SERVICE
public function fetchMessages(int $userId, int $contactId): array
{
   $contact = User::findOrFail($contactId);

   $messages = Message::betweenUsers($userId, $contactId)
            ->with(['from:id,name,image_path', 'to:id,name,image_path'])
            ->orderBy('created_at', 'asc')
            ->get();
    return [
        'contact'  => $contact,
        'messages' => $messages,
    ];
}
}
