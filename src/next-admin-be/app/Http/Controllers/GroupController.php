<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use App\Models\Role;
use App\Models\GroupUser;
use App\Models\GroupRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\ActivityLogController;

class GroupController extends Controller
{
    /**
     * Get groups from model
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

            $group = Group::withTrashed()
                ->with(['users.user' => function ($query) {
                    $query->select('id', 'name');
                }])
                ->with(['roles.role' => function ($query) {
                    $query->select('id', 'name');
                }]);

            if ($filterField && $filterMode && $filterValue) {
                switch ($filterMode) {
                    case 'contains':
                        $group = $group->where($filterField, 'LIKE', '%' . $filterValue . '%');
                        break;
                    case 'equals':
                        $group = $group->where($filterField, '=', $filterValue);
                        break;
                    case 'startsWith':
                        $group = $group->where($filterField, 'LIKE', $filterValue . '%');
                        break;
                    case 'endsWith':
                        $group = $group->where($filterField, 'LIKE', '%' . $filterValue);
                        break;
                    default:
                        break;
                }
                $total = $group->count();
            } else {
                $total = Group::withTrashed()->count();
            }

            $group = $group->offset(($page - 1) * $limit)
                ->limit($limit)
                ->orderBy($field, $sort);

            $group = $group->get();

            return response()->json([
                'success'   => true,
                'data'      => $group,
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
     * Get list of users and roles
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function dropdownList(Request $request)
    {
        try {
            return response()->json([
                'success'   => true,
                'data'      => [
                    'users' => $this->userList(),
                    'roles' => $this->roleList()
                ],
                'message'   => ''
            ]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Get list of users
     *
     * @return array
     */
    public function userList()
    {
        try {
            return User::select('id', 'name')->orderBy('name', 'asc')->get();
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Get list of roles
     *
     * @return array
     */
    public function roleList()
    {
        try {
            return Role::select('id', 'name')->get();
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Create new group
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
                'description'   => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
            // Create new group
            $group = Group::create([
                'name'          => $request->input('name'),
                'description'   => $request->input('description')
            ]);
            // Assign group with users and roles
            $this->assignUsersAndRoles($request->input('users'), $request->input('roles'), $group->id);
            // Return response
            if ($group) {
                $activityLog = new ActivityLogController();
                $activityLog->create(auth()->user()->id, config('constants.activity-log.add_group'), true);
                return response()->json([
                    'success' => true,
                    'group'   => $group,
                ], 201);
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.add_group'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Update a group
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
            // Find group by ID and update its information
            $group = Group::find($request->input('id'));
            $group->name = $request->input('name');
            $group->description = $request->input('description');
            $group->save();
            // Delete previous user and role assignment and set new pairs
            GroupUser::where('group_id', $request->input('id'))->delete();
            GroupRole::where('group_id', $request->input('id'))->delete();
            $this->assignUsersAndRoles($request->input('users'), $request->input('roles'), $group->id);
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.update_group'), true);
            return response()->json([
                'success'   => $group,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.update_group'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Assign users and roles to group
     *
     * @param array $users
     * @param array $roles
     * @param integer $groupId
     * @return boolean
     */
    private function assignUsersAndRoles($users, $roles, $groupId)
    {
        $arrUsers = [];
        foreach ($users as $user) {
            array_push($arrUsers, [
                'group_id'  => $groupId,
                'user_id'   => $user["id"]
            ]);
        }
        $gu = GroupUser::insert($arrUsers);

        $arrRoles = [];
        foreach ($roles as $role) {
            array_push($arrRoles, [
                'group_id'  => $groupId,
                'role_id'   => $role["id"]
            ]);
        }
        $gr = GroupRole::insert($arrRoles);

        return $gu && $gr;
    }

    /**
     * Delete a group
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        try {
            // Find group by ID and delete it
            $group = Group::find($request->input('id'))->delete();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.delete_group'), true);
            return response()->json([
                'success'   => $group,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.delete_group'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Restore a group
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function restore(Request $request)
    {
        try {
            // Find group by ID and restore it
            $group = Group::withTrashed()->find($request->input('id'))->restore();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.restore_group'), true);
            return response()->json([
                'success'   => $group,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.restore_group'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }
}
