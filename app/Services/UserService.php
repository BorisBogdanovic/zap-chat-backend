<?php

namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Database\Eloquent\Collection;

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


}
