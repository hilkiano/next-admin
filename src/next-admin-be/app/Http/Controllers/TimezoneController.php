<?php

namespace App\Http\Controllers;

use App\Models\Timezone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class TimezoneController extends Controller
{
    public function list(Request $request)
    {
        try {
            if (Redis::get('timezone_list')) {
                $tz = json_decode(Redis::get('timezone_list'));
            } else {
                $tz = [];
                $getTimezone = Timezone::select('name')->pluck('name');
                foreach ($getTimezone as $key => $value) {
                    array_push($tz, $value);
                }
                Redis::set('timezone_list', json_encode($tz));
            }

            return response()->json([
                'success'   => true,
                'data'      => $tz
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }
}
