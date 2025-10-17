<?php

namespace App\Http\Controllers;
use App\Http\Requests\UserSettingsRequest;
use App\Http\Requests\UpdateUserImageRequest;
use App\Http\Requests\UserSearchRequest;
use App\Http\Requests\EditUsernameRequest;
use App\Facades\UserFacade;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Exception;



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
public function updateImage(UpdateUserImageRequest $request): JsonResponse
{
    $user = auth()->user();

    if (!$request->hasFile('avatar')) {
        return response()->json([
            'status' => 'error',
            'message' => 'No avatar file uploaded.'
        ], 422);
    }

    $updatedUser=UserFacade::updateAvatar($user, $request->file('avatar'));

     return response()->json([
        'status'  => 'success',
        'message' => 'Avatar updated successfully!',
        'data'    => [
            'id'         => $updatedUser->id,
            'name'       => $updatedUser->name,
            'last_name'  => $updatedUser->last_name,
            'username'   => $updatedUser->username,
            'image_path' => $updatedUser->image_path,
            'avatar_url' => asset('storage/' . $updatedUser->image_path)
        ],
    ],200);
}
//////////////////////////////////////////////////////////////////////////////DELETE USER
public function userDelete(User $user): JsonResponse
    {
        try {
           UserFacade::deleteUser($user);

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully.'
            ], 200);

        } catch (AuthorizationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 403);
        }
    }
//////////////////////////////////////////////////////////////////////////////EDIT USERNAME 
public function editUsername(User $user, EditUsernameRequest $request): JsonResponse
    {
        try {
         $updatedUser=UserFacade::updateUsername($user, $request->username);

            return response()->json([
                'status' => 'success',
                'message' => 'Username updated successfully.',
                'data' => $updatedUser
            ], 200);

        } catch (AuthorizationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 403);
        }
    }
    
}