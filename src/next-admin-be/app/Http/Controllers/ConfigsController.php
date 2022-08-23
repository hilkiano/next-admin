<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class ConfigsController extends Controller
{
    /**
     * Get app configs
     *
     * @return \Illuminate\Support\Facades\Response
     */
    public function get()
    {
        try {
            if (Redis::exists('configs')) {
                $simplified = json_decode(Redis::get('configs'));
            } else {
                $configs = Config::all();
                $simplified = [];
                foreach ($configs as $config) {
                    array_push($simplified, [
                        "id"    => $config->id,
                        "name"  => $config->name,
                        "value" => $config->value,
                        "type"  => $config->type
                    ]);
                }
                Redis::set('configs', json_encode($simplified));
            }

            return response()->json([
                'success'   => true,
                'data'      => $simplified
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Update configs
     *
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Support\Facades\Response
     */
    public function update(Request $request)
    {
        try {
            $req = $request->input("configs");

            foreach ($req as $config => $value) {
                $update = Config::where('name', $config)->update(['value' => $value]);
            }

            $keys = Redis::keys('userinfo_*');
            if (!empty($keys)) {
                $keys = array_map(function ($k) {
                    return str_replace('nextadmin_database_', '', $k);
                }, $keys);
                Redis::del($keys);
            }

            Redis::del('configs');
            $configs = Config::all();
            $simplified = [];
            foreach ($configs as $config) {
                array_push($simplified, [
                    "id"    => $config->id,
                    "name"  => $config->name,
                    "value" => $config->value,
                    "type"  => $config->type
                ]);
            }
            Redis::set('configs', json_encode($simplified));

            return response()->json([
                'success'   => true,
                'data'      => $simplified
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
