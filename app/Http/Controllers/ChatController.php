<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\MessageRequest;
use App\Http\Requests\FetchMessageRequest;
use App\Facades\Chat;

class ChatController extends Controller
{
//////////////////////////////////////////////////////////////////////////////SEND MESSAGES TO OTHER USER
public function store(MessageRequest $request)
{
    try {
        $message = Chat::send(
            (int) auth()->id(),
            (int) $request->to_id,
            (string) $request->message
        );

        return response()->json([
            'status'  => true,
            'message' => 'Message sent successfully.',
            'data'    => $message,
        ], 201);

    } catch (\Throwable $e) {
        Log::error('Message send failed', ['error' => $e->getMessage()]);

        return response()->json([
            'status'  => false,
            'message' => 'Failed to send message.',
            'data'    => null,
        ], 500);
    }
}
//////////////////////////////////////////////////////////////////////////////GET MESSAGES BETWEEN USERS
public function fetchMessages(FetchMessageRequest $request)
{
   try{
    $contactId = (int) $request->contact_id;
    $data = Chat::fetchMessages(auth()->id(), $contactId);

   return response()->json([
            'status'  => true,
            'message' => 'Messages fetched successfully.',
            'data'    => [
                'contact'  => $data['contact'],
                'messages' => $data['messages'],
            ],
        ], 200);

   }catch (\Throwable $e) {
        Log::error('Messages fetch failed', [
            'user_id' => auth()->id(),
            'contact_id' => $request->contact_id,
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'status'  => false,
            'message' => 'Failed to fetch messages.',
            'data'    => null,
        ], 500);
    }

}
}
