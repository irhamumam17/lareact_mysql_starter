<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => 'password',
        ]);

        $admin->assignRole('admin');

        $user = User::create([
            'name' => 'User',
            'email' => 'user@user.com',
            'password' => 'password',
        ]);

        $user->assignRole('user');
    }
}
