<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class TimezoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $json = Storage::disk('local')->get('timezone.json');
        $toArr = json_decode($json, true);
        $insertArr = [];
        foreach ($toArr as $key => $value) {
            array_push($insertArr, [
                "name"      => $key,
                "offset"    => $value
            ]);
        }

        DB::table('timezone')->insert($insertArr);
    }
}
