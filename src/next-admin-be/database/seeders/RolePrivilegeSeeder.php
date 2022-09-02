<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class RolePrivilegeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // All privileges only for superadmin role
        $supe = [];
        for ($x = 1; $x <= 24; $x++) {
            array_push($supe, [
                'role_id' => 1,
                'privilege_id' => $x
            ]);
        }

        // Demo privileges
        $demo = [
            [
                'role_id'       => 2,
                'privilege_id'  => 1
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 2
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 3
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 4
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 5
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 6
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 7
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 8
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 9
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 10
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 15
            ],
            [
                'role_id'       => 2,
                'privilege_id'  => 16
            ],
        ];
        $arr = Arr::collapse([$supe, $demo]);
        Log::info(print_r($arr, true));
        DB::table('role_privilege_mapping')->insert($arr);
    }
}
