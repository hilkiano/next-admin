<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use App\Http\Controllers\ActivityLogController;

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
            $configs = $this->retrieveList();

            // Return response
            return response()->json([
                'success'   => true,
                'data'      => $configs
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    public function retrieveList()
    {
        // Check Redis for config cache
        if (Redis::exists('configs')) {
            $configs = json_decode(Redis::get('configs'));
        } else {
            $model = Config::all();
            $configs = [];
            foreach ($model as $config) {
                array_push($configs, [
                    "id"    => $config->id,
                    "name"  => $config->name,
                    "value" => $config->value,
                    "type"  => $config->type
                ]);
            }
            Redis::set('configs', json_encode($configs));
        }

        return $configs;
    }

    /**
     * Update default configs
     *
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Support\Facades\Response
     */
    public function update(Request $request)
    {
        try {
            $req = $request->input("configs");
            // Update config by name
            foreach ($req as $config => $value) {
                $update = Config::where('name', $config)->update(['value' => $value]);
            }
            // Delete all user cache
            $keys = Redis::keys('userinfo_*');
            if (!empty($keys)) {
                $keys = array_map(function ($k) {
                    return str_replace('nextadmin_database_', '', $k);
                }, $keys);
                Redis::del($keys);
            }
            // Delete configs cache and set new one
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
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.change_default_config'), true);
            return response()->json([
                'success'   => true,
                'data'      => $simplified
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.change_default_config'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }
}
