<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Log;

class ActivityLogController extends Controller
{
    /**
     * Create new activity log
     *
     * @param  int $userId
     * @param  string $logString
     * @param  boolean $status
     * @return \App\Models\ActivityLog $log
     */
    public function create($userId = null, $logString = null, $status = true)
    {
        try {
            // Create new activity log
            $log = new ActivityLog();

            $log->user_id = $userId;
            $log->log_string = $logString;
            $log->status = $status;

            $log->save();
            return $log;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
        }
    }

    public function list(Request $request)
    {
        try {
            $mode = $request->has('mode') ? $request->input('mode') : null;
            $total = 0;
            // Fetch list by mode
            if ($mode === 'top-5') {
                $log = ActivityLog::where('user_id', auth()->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get();
                $total = 5;
            } else {
                $log = [];
                $total = 0;
            }
            // Return response
            return response()->json([
                'success'   => true,
                'data'      => $log,
                'total'     => $total,
                'message'   => ''
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
