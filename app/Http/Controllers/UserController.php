<?php

namespace App\Http\Controllers;
use App\Http\Requests\UserSettingsRequest;
use App\Http\Requests\UpdateUserImageRequest;
use Illuminate\Support\Facades\Auth; 
use App\Models\User; 

use Illuminate\Http\Request;

class UserController extends Controller
{
//////////////////////////////////////////////////////////////////////////////EDIT USERS SETTIGNS
public function settings(UserSettingsRequest $request){
   
}

//////////////////////////////////////////////////////////////////////////////UPDATE USER IMAGE
public function updateImage(UpdateUserImageRequest $request){
    
   }

  
//////////////////////////////////////////////////////////////////////////////GET USERS
public function fetchUsers(){
   
   $users = User::where('id', '!=', Auth::user()->id)
                 ->get(['id', 'name', 'last_name', 'email', 'image_path', 'username']);

    return response()->json([
        'status'=>'success',
        'message'=>"Users fetched successfully!",
        'data'=>$users

    ]);
}
}
