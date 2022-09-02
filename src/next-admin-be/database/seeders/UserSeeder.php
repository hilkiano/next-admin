<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create superadmin and demo
        User::insert([
            [
                'name' => 'Super Admin',
                'email' => 'superadmin931120@gmail.com',
                'username' => 'superadmin',
                'password' => Hash::make('N0hansen!Z_')
            ],
            [
                'name' => 'Demo User',
                'email' => 'demouser931120@gmail.com',
                'username' => 'demo',
                'password' => Hash::make('12345')
            ]
        ]);

        // Create random user 100 times
        // \App\Models\User::factory(100)->create();
    }
}
