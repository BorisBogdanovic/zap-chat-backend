<?php

namespace App\Services;

use App\Models\Message;
use App\Events\MessageSent;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatService
{

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

public function fetchMessages(int $userId, int $contactId, int $perPage = 20, int $page = 1): array
{
    $contact = User::findOrFail($contactId);

    $messages = Message::betweenUsers($userId, $contactId)
        ->with(['from:id,name,image_path', 'to:id,name,image_path'])
        ->orderBy('created_at', 'asc')
        ->orderBy('id', 'asc')
        ->paginate($perPage, ['*'], 'page', $page);

    return [
        'contact'      => $contact,
        'messages'     => $messages->items(),
        'current_page' => $messages->currentPage(),
        'last_page'    => $messages->lastPage(),
        'per_page'     => $messages->perPage(),
        'total'        => $messages->total(),
        'next_page'    => $messages->nextPageUrl(),
        'prev_page'    => $messages->previousPageUrl(),
    ];
}
}
