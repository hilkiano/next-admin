<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('menus')->insert([
            [
                'name'  => 'home',
                'order' => 1,
                'is_parent' => false,
                'icon'  => 'home',
                'parent'    => null,
                'url'   => '/',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'administrator',
                'order' => 99,
                'is_parent' => true,
                'icon'  => 'admin_panel_settings',
                'parent'    => null,
                'url'   => null,
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'user',
                'order' => 1,
                'is_parent' => false,
                'icon'  => 'person',
                'parent'    => 'administrator',
                'url'   => '/admin/user',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'menu',
                'order' => 2,
                'is_parent' => false,
                'icon'  => 'menu_book',
                'parent'    => 'administrator',
                'url'   => '/admin/menu',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'group',
                'order' => 3,
                'is_parent' => false,
                'icon'  => 'group',
                'parent'    => 'administrator',
                'url'   => '/admin/group',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'role',
                'order' => 4,
                'is_parent' => false,
                'icon'  => 'local_police',
                'parent'    => 'administrator',
                'url'   => '/admin/role',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'privilege',
                'order' => 5,
                'is_parent' => false,
                'icon'  => 'star',
                'parent'    => 'administrator',
                'url'   => '/admin/privilege',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'configuration',
                'order' => 6,
                'is_parent' => false,
                'icon'  => 'settings',
                'parent'    => 'administrator',
                'url'   => '/admin/configuration',
                'created_at' => Carbon::now()
            ],
        ]);
    }
}
