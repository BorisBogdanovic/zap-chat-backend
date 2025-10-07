<?php

namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

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


public function updateSettings(User $user, array $data): User
{
       
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->fill($data);
        $user->save();

        return $user;
}


}
