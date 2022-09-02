<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('group_role_mapping')->insert([
            [
                'group_id' => 1,
                'role_id'  => 1
            ],
            [
                'group_id' => 2,
                'role_id'  => 2
            ]
        ]);
    }
}
