<?php

namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;


class UserService
{
    
   
//////////////////////////////////////////////////////////////////////////////GET USERS SERVICES
public function fetchUsers(?string $search = null): Collection
{
        $query = User::where('id', '!=', Auth::id());

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        return $query->get(['id', 'name', 'last_name', 'email', 'image_path', 'username']);
}  

//////////////////////////////////////////////////////////////////////////////EDIT USER SETTIGS SERVICES
public function updateSettings(User $user, array $data): User
{
       
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->fill($data);
        $user->save();

        return $user;
}
//////////////////////////////////////////////////////////////////////////////EDIT USER AVATAR SERVICES
public function updateAvatar(User $user, UploadedFile $file): User
{
        $timestamp = now()->timestamp;
        $ext = $file->getClientOriginalExtension();
        $slugUsername = Str::slug($user->username);
        $fileName = 'avatar_' . $user->id . '_' . $slugUsername . '_' . $timestamp . '.' . $ext;

      
        $path = $file->storeAs('images/avatars', $fileName, 'public');

       
        if ($user->image_path !== 'images/default.png' && Storage::disk('public')->exists($user->image_path)) {
            Storage::disk('public')->delete($user->image_path);
        }

        $user->image_path = $path;
        $user->save();

        return $user;
}


}
