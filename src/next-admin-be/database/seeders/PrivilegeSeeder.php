<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrivilegeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('privileges')->insert([
            [
                'name'          => 'PAGE_HOME',
                'description'   => 'Access for menu: HOME'
            ],
            [
                'name'          => 'PAGE_ADMINISTRATOR',
                'description'   => 'Access for menu: ADMINISTRATOR'
            ],
            [
                'name'          => 'PAGE_USER',
                'description'   => 'Access for menu: USER'
            ],
            [
                'name'          => 'PAGE_MENU',
                'description'   => 'Access for menu: MENU'
            ],
            [
                'name'          => 'PAGE_GROUP',
                'description'   => 'Access for menu: GROUP'
            ],
            [
                'name'          => 'PAGE_ROLE',
                'description'   => 'Access for menu: ROLE'
            ],
            [
                'name'          => 'PAGE_PRIVILEGE',
                'description'   => 'Access for menu: PRIVILEGE'
            ],
            [
                'name'          => 'PAGE_CONFIGURATION',
                'description'   => 'Access from menu: CONFIGURATION'
            ]
        ]);
    }
}
