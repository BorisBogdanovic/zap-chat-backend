<?php

namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use App\Models\Message;
use Illuminate\Http\JsonResponse;


class UserService
{
    
   
//////////////////////////////////////////////////////////////////////////////GET USERS SERVICES
public function fetchUsers(?string $search = null): Collection
{
    $authId = Auth::id();

    $baseFilter = function ($q) use ($authId) {
        $q->where(function ($q2) use ($authId) {
           $q2->whereColumn('from_id', 'users.id')->where('to_id', $authId);
        })->orWhere(function ($q3) use ($authId) {
            $q3->where('from_id', $authId)->whereColumn('to_id', 'users.id');
        });
    };

    $query = User::query()
        ->where('id', '!=', $authId)
        ->when($search, function ($q) use ($search) {
            $q->where(function ($q2) use ($search) {
                $q2->where('name', 'like', "%{$search}%")
                   ->orWhere('last_name', 'like', "%{$search}%")
                   ->orWhere('username', 'like', "%{$search}%");
            });
        })
        // Kolone za poslednju poruku između ulogovanog i svakog usera
        ->addSelect([
            'id', 'name', 'last_name', 'email', 'image_path', 'username','is_admin',
            // tekst poslednje poruke
            'last_message' => Message::select('message')
                ->where($baseFilter)
                ->latest('created_at')
                ->limit(1),
            // vreme poslednje poruke (korisno za sortiranje)
            'last_message_at' => Message::select('created_at')
                ->where($baseFilter)
                ->latest('created_at')
                ->limit(1),
            // ko je poslao poslednju poruku (da na frontu znaš da li da staviš "You:" prefiks)
            'last_message_from_id' => Message::select('from_id')
                ->where($baseFilter)
                ->latest('created_at')
                ->limit(1),
        ])
        // opciono: sortiraj listu po svežini chata (NULL ide na dno)
        ->orderByDesc('last_message_at');

    return $query->get();
}

//////////////////////////////////////////////////////////////////////////////EDIT USER SETTIGS SERVICES
public function updateSettings(User $user, array $data): User
{
    if (!empty($data['password'])) {
        $data['password'] = Hash::make($data['password']);
    } else {
        unset($data['password']);
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
//////////////////////////////////////////////////////////////////////////////DELETE USER BY ADMIN
 public function deleteUser(User $user): void
    {
        $authUser = Auth::user();

        if (!$authUser->is_admin) {
            throw new AuthorizationException('You are not authorized to delete users.');
        }

        if ($authUser->id === $user->id) {
            throw new AuthorizationException('You cannot delete your own account.');
        }
        
        if ($user->is_admin) {
            throw new AuthorizationException('You cannot delete another admin.');
        }

        $user->delete();
}
//////////////////////////////////////////////////////////////////////////////EDITING USERNAME
    public function updateUsername(User $user, string $newUsername): User
    {
        $authUser = Auth::user();

        if (!$authUser->is_admin) {
            throw new AuthorizationException('You are not authorized.');
        }

        if ($user->is_admin) {
            throw new AuthorizationException('You cannot edit another admin.');
        }

       $user->username = $newUsername;
        $user->save();

        return $user;
    }

}
