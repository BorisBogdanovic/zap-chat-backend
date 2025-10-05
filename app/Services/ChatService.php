<?php

namespace App\Services;

use App\Models\Message;
use App\Events\MessageSent;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatService
{
//////////////////////////////////////////////////////////////////////////////GET MESSAGES SERVICE
public function send($fromId, $toId, $messageText)
{
    $message = Message::create([
        'from_id' => $fromId,
        'to_id'   => $toId,
        'message' => $messageText,
        'read_at' => null,
    ]);

    event(new MessageSent($messageText, $fromId, $toId));

    return $message;
}
//////////////////////////////////////////////////////////////////////////////SEND MESSAGES SERVICE
public function fetchMessages($contactId)
{
    $contact = User::findOrFail($contactId);

    $messages = Message::where(function ($q) use ($contactId) {
            $q->where('from_id', Auth::id())
              ->where('to_id', $contactId);
        })
        ->orWhere(function ($q) use ($contactId) {
            $q->where('from_id', $contactId)
              ->where('to_id', Auth::id());
        })
        ->orderBy('created_at', 'asc')
        ->get();

    return [
        'contact'  => $contact,
        'messages' => $messages,
    ];
}
}
