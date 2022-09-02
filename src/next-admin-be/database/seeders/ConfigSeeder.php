<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

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
                'description' => 'Application default language',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'app.theme',
                'value' => 'light',
                'type'  => 'string',
                'description' => 'Application default theme',
                'created_at' => Carbon::now()
            ],
            [
                'name'  => 'app.tz',
                'value' => 'Asia/Jakarta',
                'type'  => 'string',
                'description' => 'Application default timezone',
                'created_at' => Carbon::now()
            ]
        ]);
    }
}
