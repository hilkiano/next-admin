<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

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
                'description'   => 'Access for menu: HOME',
                'created_at' => Carbon::now()
            ],
            [
                'name'          => 'PAGE_ADMINISTRATOR',
                'description'   => 'Access for menu: ADMINISTRATOR',
                'created_at' => Carbon::now()
            ],
            [
                'name'          => 'PAGE_USER',
                'description'   => 'Access for menu: USER',
                'created_at' => Carbon::now()
            ],
            [
                'name'          => 'PAGE_MENU',
                'description'   => 'Access for menu: MENU',
                'created_at' => Carbon::now()
            ],
            [
                'name'          => 'PAGE_GROUP',
                'description'   => 'Access for menu: GROUP',
                'created_at' => Carbon::now()
            ],
            [
                'name'          => 'PAGE_ROLE',
                'description'   => 'Access for menu: ROLE',
                'created_at' => Carbon::now()
            ],
            [
                'name'          => 'PAGE_PRIVILEGE',
                'description'   => 'Access for menu: PRIVILEGE',
                'created_at' => Carbon::now()
            ],
            [
                'name'          => 'PAGE_CONFIGURATION',
                'description'   => 'Access from menu: CONFIGURATION',
                'created_at' => Carbon::now()
            ],
            [
                'name'          => 'ACT_ADD_USER',
                'description'   => 'Ability to create new user',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_EDIT_USER',
                'description'   => 'Ability to edit a user',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_DELETE_RESTORE_USER',
                'description'   => 'Ability to delete/restore a user',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_ADD_MENU',
                'description'   => 'Ability to create new menu',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_EDIT_MENU',
                'description'   => 'Ability to edit a menu',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_DELETE_RESTORE_MENU',
                'description'   => 'Ability to delete/restore a menu',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_ADD_GROUP',
                'description'   => 'Ability to create new group',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_EDIT_GROUP',
                'description'   => 'Ability to edit a group',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_DELETE_RESTORE_GROUP',
                'description'   => 'Ability to delete/restore a group',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_ADD_ROLE',
                'description'   => 'Ability to create new role',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_EDIT_ROLE',
                'description'   => 'Ability to edit a role',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_DELETE_RESTORE_ROLE',
                'description'   => 'Ability to delete/restore a role',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_ADD_PRIVILEGE',
                'description'   => 'Ability to create new privilege',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_EDIT_PRIVILEGE',
                'description'   => 'Ability to edit a privilege',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_DELETE_RESTORE_PRIVILEGE',
                'description'   => 'Ability to delete/restore a privilege',
                'created_at'    => Carbon::now()
            ],
            [
                'name'          => 'ACT_UPDATE_DEFAULT_CONFIG',
                'description'   => 'Ability to update application default configurations',
                'created_at'    => Carbon::now()
            ],
        ]);
    }
}
