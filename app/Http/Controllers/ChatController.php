<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSent;
use App\Http\Requests\MessageRequest;

class ChatController extends Controller
{
public function sendMessage(MessageRequest $request){

        $message = Message::create([
        'from_id' => auth()->id(),
        'to_id'   => $request->to_id,
        'message' => $request->message,
        'read_at' => null,
    ]);

    event(new MessageSent($request->message,auth()->id(),$request->to_id));

    return response()->json([
            'status' => 'success',
            'data'    => $message,
        ]);
}
}
