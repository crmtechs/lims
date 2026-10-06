<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run()
    {
        $users = [
            [
                'name' => 'Hiren Darji',
                'email' => 'info@crmtechs.com',
                'username' => 'crmtechs',
                'password' => 'Ct@123',
                'status' => 'active',
            ],
            [
                'name' => 'Jayant Lad',
                'email' => 'support@crmtechs.com',
                'username' => 'jayant.lad',
                'password' => 'Ct@123',
                'status' => 'active',
            ],
            [
                'name' => 'Tisha Patel',
                'email' => 'support@crmtechs.com',
                'username' => 'tisha.patel',
                'password' => 'Ct@123',
                'status' => 'inactive',
            ],
        ];

        foreach ($users as $user)
        {
            $existingUser = User::where('username', $user['username'])->first();

            if (!$existingUser)
            {
                User::factory()->create($user);
            }
        }
    }
}
