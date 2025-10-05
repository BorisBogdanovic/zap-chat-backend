<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use App\Http\Requests\MessageRequest;
use App\Http\Requests\FetchMessageRequest;
use Illuminate\Support\Facades\Auth; 
use App\Facades\Message as MessageFacade;

class ChatController extends Controller
{
//////////////////////////////////////////////////////////////////////////////GET MESSAGES BETWEEN USERS
public function fetchMessages(FetchMessageRequest $request)
{
    $data = MessageFacade::fetchMessages($request->contact_id);

    return response()->json([
        'status'   => 'success',
        'contact'  => $data['contact'],
        'messages' => $data['messages'],
    ]);
}
//////////////////////////////////////////////////////////////////////////////SEND MESSAGES TO OTHER USER
public function sendMessage(MessageRequest $request)
{
    $message = MessageFacade::send(
        auth()->id(),
        $request->to_id,
        $request->message
    );

    return response()->json([
        'status' => 'success',
        'data'   => $message,
    ]);
}
}
