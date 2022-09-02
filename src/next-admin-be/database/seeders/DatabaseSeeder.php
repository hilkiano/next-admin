<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            MenuSeeder::class,
            GroupSeeder::class,
            RoleSeeder::class,
            PrivilegeSeeder::class,
            GroupRoleSeeder::class,
            GroupUserSeeder::class,
            RolePrivilegeSeeder::class,
            ConfigSeeder::class,
            TimezoneSeeder::class
        ]);
    }
}
