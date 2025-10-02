<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use App\Http\Requests\MessageRequest;
use App\Http\Requests\FetchMessageRequest;
use Illuminate\Support\Facades\Auth; 

class ChatController extends Controller
{

public function fetchMessages (FetchMessageRequest $request ){

  $contact= User::findOrFail($request->contact_id);

   $messages = Message::where(function($q) use ($request) {
        $q->where('from_id', Auth::id())
          ->where('to_id', $request->contact_id);
    })
    ->orWhere(function($q) use ($request) {
        $q->where('from_id', $request->contact_id)
          ->where('to_id', Auth::id());
    })
    ->orderBy('created_at', 'asc')
    ->get();



     return response()->json([
        'status' => 'success',
        'contact'=>$contact,
        'messages'=>$messages
     ]);
} 
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
