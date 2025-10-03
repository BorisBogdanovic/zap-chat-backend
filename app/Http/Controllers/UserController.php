<?php

namespace App\Http\Controllers;
use App\Http\Requests\UserSettingsRequest;
use App\Http\Requests\UpdateUserImageRequest;
use App\Http\Requests\UserSearchRequest;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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
    $user = auth()->user();

    if (!$request->hasFile('avatar')) {
        return response()->json([
            'status' => 'error',
            'message' => 'No avatar file uploaded.'
        ], 422);
    }

    $file = $request->file('avatar');
    $timestamp = now()->timestamp;
    $ext = $file->getClientOriginalExtension();
  $fileName = 'avatar_' . $user->id . '_' . $user->username . '_' . $timestamp . '.' . $ext;

    $path = $file->storeAs('images/avatars', $fileName, 'public');

    if ($user->image_path !== 'images/default.png' && Storage::disk('public')->exists($user->image_path)) {
        Storage::disk('public')->delete($user->image_path);
    }

    $user->image_path = $path;
    $user->save();

    return response()->json([
        'status'  => 'success',
        'message' => 'Avatar updated successfully!',
        'data'    => [
            'id'         => $user->id,
            'name'       => $user->name,
            'last_name'  => $user->last_name,
            'username'   => $user->username,
            'image_path' => $user->image_path,
            'avatar_url' => asset('storage/' . $user->image_path)
        ],
    ]);
}
//////////////////////////////////////////////////////////////////////////////GET USERS
public function fetchUsers(UserSearchRequest $request){
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