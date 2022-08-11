<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

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
                'label' => 'Home',
                'is_parent' => false,
                'icon'  => 'home',
                'parent'    => null,
                'url'   => '/'
            ],
            [
                'name'  => 'administrator',
                'label' => 'Administrator',
                'is_parent' => true,
                'icon'  => 'admin_panel_settings',
                'parent'    => null,
                'url'   => null
            ],
            [
                'name'  => 'user',
                'label' => 'User',
                'is_parent' => false,
                'icon'  => 'person',
                'parent'    => 'administrator',
                'url'   => '/admin/user'
            ],
            [
                'name'  => 'menu',
                'label' => 'Menu',
                'is_parent' => false,
                'icon'  => 'menu_book',
                'parent'    => 'administrator',
                'url'   => '/admin/menu'
            ],
            [
                'name'  => 'group',
                'label' => 'Group',
                'is_parent' => false,
                'icon'  => 'group',
                'parent'    => 'administrator',
                'url'   => '/admin/group'
            ],
            [
                'name'  => 'role',
                'label' => 'Role',
                'is_parent' => false,
                'icon'  => 'local_police',
                'parent'    => 'administrator',
                'url'   => '/admin/role'
            ],
            [
                'name'  => 'privilege',
                'label' => 'Privilege',
                'is_parent' => false,
                'icon'  => 'star',
                'parent'    => 'administrator',
                'url'   => '/admin/privilege'
            ],
        ]);
    }
}
