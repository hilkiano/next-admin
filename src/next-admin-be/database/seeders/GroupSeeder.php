<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('groups')->insert(
            [
                'name'  => 'Super Administrator',
                'description'  => 'Group of users that have access to all objects in the system.'
            ]
        );
    }
}
