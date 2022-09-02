<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('groups')->insert([
            [
                'name'  => 'Super Administrator',
                'description'  => 'Group of users that have access to all objects in the system.',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'Demo Users',
                'description'  => 'Group of users for demo application.',
                'created_at' => Carbon::now()
            ]
        ]);
    }
}
