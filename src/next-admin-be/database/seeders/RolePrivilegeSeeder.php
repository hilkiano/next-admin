<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePrivilegeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('role_privilege_mapping')->insert([
            [
                'role_id'       => 1,
                'privilege_id'  => 1
            ],
            [
                'role_id'       => 1,
                'privilege_id'  => 2
            ],
            [
                'role_id'       => 1,
                'privilege_id'  => 3
            ],
            [
                'role_id'       => 1,
                'privilege_id'  => 4
            ],
            [
                'role_id'       => 1,
                'privilege_id'  => 5
            ],
            [
                'role_id'       => 1,
                'privilege_id'  => 6
            ],
            [
                'role_id'       => 1,
                'privilege_id'  => 7
            ],
            [
                'role_id'       => 1,
                'privilege_id'  => 8
            ],
        ]);
    }
}
