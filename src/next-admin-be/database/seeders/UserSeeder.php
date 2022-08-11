<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create superadmin
        \App\Models\User::factory()->create([
            'name' => 'Hilkia Nohansen',
            'email' => 'hilkia.nohansen@gmail.com',
            'username' => 'superadmin',
            'password' => Hash::make('12345')
        ]);
        // Create random user 100 times
        \App\Models\User::factory(100)->create();
    }
}
