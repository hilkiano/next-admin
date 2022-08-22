<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('configs')->insert([
            [
                'name'  => 'app.language',
                'value' => 'en',
                'type'  => 'string',
                'description' => 'Application default language'
            ]
        ]);
    }
}
