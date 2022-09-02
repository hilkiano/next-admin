<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            [
                'name'  => 'All Access',
                'description'  => 'Role consists of all privileges available in the system.',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'Demo Access',
                'description'  => 'Access limited for application demo.',
                'created_at' => Carbon::now()
            ]
        ]);
    }
}
