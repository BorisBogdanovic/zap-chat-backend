<?php

namespace App\Http\Controllers;
use App\Http\Requests\UserSettingsRequest;
use App\Http\Requests\UpdateUserImageRequest;
use App\Http\Requests\UserSearchRequest;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Hash;
use App\Models\User; 

use Illuminate\Http\Request;

class UserController extends Controller
{
//////////////////////////////////////////////////////////////////////////////EDIT USERS SETTIGNS
public function settings(UserSettingsRequest $request){
    
    $user = auth()->user();
    $user->fill($request->only([
        'name',
        'last_name',
        'username',
    ]));

    if ($request->filled('password')) {
        $user->password = Hash::make($request->password);
    }

    $user->save();

    return response()->json([
        'status'  => 'success',
        'message' => 'Settings updated successfully!',
        'data'    => $user,
    ]);
}

//////////////////////////////////////////////////////////////////////////////UPDATE USER IMAGE
public function updateImage(UpdateUserImageRequest $request){
    
   }

  
//////////////////////////////////////////////////////////////////////////////GET USERS
public function fetchUsers(UserSearchRequest $request)
{
    $query = User::where('id', '!=', Auth::id());

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('username', 'like', "%{$search}%");
        });
    }

    $users = $query->get(['id', 'name', 'last_name', 'email', 'image_path', 'username']);

    return response()->json([
        'status'  => 'success',
        'message' => 'Users fetched successfully!',
        'data'    => $users
    ]);
}



}