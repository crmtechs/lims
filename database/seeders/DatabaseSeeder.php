<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run()
    {
        $users = [
            [
                'uuid' => '1',
                'first_name' => 'Hiren',
                'last_name' => 'Darji',
                'username' => 'crmtechs',
                'email' => 'info@crmtechs.com',
                'password' => 'Ct@123',
                'status' => 'active',
                'user_type' => 'super',
                'remember_token' => Str::random(10),
            ],
            [
                'first_name' => 'Jayant',
                'last_name' => 'Lad',
                'username' => 'jayant.lad',
                'email' => 'support@crmtechs.com',
                'password' => 'Ct@123',
                'status' => 'active',
                'user_type' => 'admin',
                'remember_token' => Str::random(10),
            ],
            [
                'first_name' => 'Tisha',
                'last_name' => 'Patel',
                'username' => 'tisha.patel',
                'email' => 'support@crmtechs.com',
                'password' => 'Ct@123',
                'status' => 'inactive',
                'user_type' => 'user',
                'remember_token' => Str::random(10),
            ],
        ];

        foreach ($users as $user)
        {
            $existingUser = User::where('username', $user['username'])->first();

            if (!$existingUser)
            {
                User::create($user);
            }
        }
    }
}
