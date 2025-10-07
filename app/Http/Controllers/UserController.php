<?php

namespace App\Http\Controllers;
use App\Http\Requests\UserSettingsRequest;
use App\Http\Requests\UpdateUserImageRequest;
use App\Http\Requests\UserSearchRequest;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Facades\UserFacade;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;



use Illuminate\Http\Request;

class UserController extends Controller
{

//////////////////////////////////////////////////////////////////////////////GET USERS
public function fetchUsers(UserSearchRequest $request): JsonResponse
{
    try {
        $users = UserFacade::fetchUsers($request->search);

        return response()->json([
            'status'  => true,
            'message' => 'Users fetched successfully!',
            'data'    => $users,
        ], 200);

    } catch (\Throwable $e) {
        \Log::error('Failed to fetch users', ['error' => $e->getMessage()]);

        return response()->json([
            'status'  => false,
            'message' => 'Failed to fetch users.',
            'data'    => null,
        ], 500);
    }
}
//////////////////////////////////////////////////////////////////////////////EDIT USERS SETTIGNS
public function settings(UserSettingsRequest $request): JsonResponse
{
        $user = auth()->user();
        
        $updatedUser = UserFacade::updateSettings(
            $user,
            $request->only(['name', 'last_name', 'username', 'password'])
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'Settings updated successfully!',
            'data'    => $updatedUser, 
        ], 200);
}
//////////////////////////////////////////////////////////////////////////////UPDATE USER IMAGE
public function updateImage(UpdateUserImageRequest $request)
{
    $user = auth()->user();
    if(!$request->hasFile('avatar')) {
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
    if($user->image_path !== 'images/default.png' && Storage::disk('public')->exists($user->image_path)){
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


}