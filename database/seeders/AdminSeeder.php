<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          User::create([
            'name' => 'Boris',
            'last_name'=> 'Bogdanovic',
            'email' => 'bbogdanovic167@gmail.com',
            'password' => Hash::make('boris123'),
            'image_path' => 'images/default.png',
            'username' => 'Borisha93',
            'is_admin' => true,
        ]);

         User::create([
            'name' => 'Jovan',
            'last_name'=> 'Vuksanovic',
            'email' => 'jovanvuks1995@gmail.com',
            'password' => Hash::make('jovan123'),
            'image_path' => 'images/default.png',
            'username' => 'Joca',
            'is_admin' => true,
            
        ]);

       
    }
}
