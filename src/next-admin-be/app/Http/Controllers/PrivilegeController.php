<?php

namespace App\Http\Controllers;

use App\Models\Privilege;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\ActivityLogController;

class PrivilegeController extends Controller
{
    /**
     * Get privileges from model
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        try {
            $page = $request->input('page');
            $limit = $request->input('limit');
            $sort = $request->input('sort');
            $field = $request->input('field');
            $filterField = ($request->has('filterField')) ? $request->input('filterField') : null;
            $filterMode = ($request->has('filterMode')) ? $request->input('filterMode') : null;
            $filterValue = ($request->has('filterValue')) ? $request->input('filterValue') : null;

            $privilege = Privilege::withTrashed();

            if ($filterField && $filterMode && $filterValue) {
                switch ($filterMode) {
                    case 'contains':
                        $privilege = $privilege->where($filterField, 'LIKE', '%' . $filterValue . '%');
                        break;
                    case 'equals':
                        $privilege = $privilege->where($filterField, '=', $filterValue);
                        break;
                    case 'startsWith':
                        $privilege = $privilege->where($filterField, 'LIKE', $filterValue . '%');
                        break;
                    case 'endsWith':
                        $privilege = $privilege->where($filterField, 'LIKE', '%' . $filterValue);
                        break;
                    default:
                        break;
                }
                $total = $privilege->count();
            } else {
                $total = Privilege::withTrashed()->count();
            }

            $privilege = $privilege->offset(($page - 1) * $limit)
                ->limit($limit)
                ->orderBy($field, $sort);

            $privilege = $privilege->get();

            return response()->json([
                'success'   => true,
                'data'      => $privilege,
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

    /**
     * Create new privilege
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function add(Request $request)
    {
        try {
            // Define form validation rules
            $validator = Validator::make($request->all(), [
                'name'          => 'required|unique:groups',
                'description'   => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
            // Create new privilege
            $privilege = Privilege::create([
                'name'          => $request->input('name'),
                'description'   => $request->input('description')
            ]);
            // Return response
            if ($privilege) {
                $activityLog = new ActivityLogController();
                $activityLog->create(auth()->user()->id, config('constants.activity-log.add_privilege'), true);
                return response()->json([
                    'success'   => true,
                    'privilege' => $privilege,
                ], 201);
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.add_privilege'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Update a privilege
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        try {
            // Define form validation rules
            $validator = Validator::make($request->all(), [
                'name'          => 'required',
                'description'   => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
            // Find privilege by ID and update its information
            $privilege = Privilege::find($request->input('id'));
            $privilege->name = $request->input('name');
            $privilege->description = $request->input('description');
            $privilege->save();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.update_privilege'), true);
            return response()->json([
                'success'   => $privilege,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.update_privilege'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Delete a privilege
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        try {
            // Delete privilege by ID
            $privilege = Privilege::find($request->input('id'))->delete();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.delete_privilege'), true);
            return response()->json([
                'success'   => $privilege,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.delete_privilege'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Restore a privilege
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function restore(Request $request)
    {
        try {
            // Restore privilege by ID
            $privilege = Privilege::withTrashed()->find($request->input('id'))->restore();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.restore_privilege'), true);
            return response()->json([
                'success'   => $privilege,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.restore_privilege'), true);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }
}
