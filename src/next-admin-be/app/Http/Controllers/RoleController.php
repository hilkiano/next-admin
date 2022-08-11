<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\RolePrivilege;
use App\Models\Privilege;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    /**
     * Get roles from model
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

            $role = Role::withTrashed()
                ->with(['privileges.privilege' => function ($query) {
                    $query->select('id', 'name');
                }]);

            if ($filterField && $filterMode && $filterValue) {
                switch ($filterMode) {
                    case 'contains':
                        $role = $role->where($filterField, 'LIKE', '%' . $filterValue . '%');
                        break;
                    case 'equals':
                        $role = $role->where($filterField, '=', $filterValue);
                        break;
                    case 'startsWith':
                        $role = $role->where($filterField, 'LIKE', $filterValue . '%');
                        break;
                    case 'endsWith':
                        $role = $role->where($filterField, 'LIKE', '%' . $filterValue);
                        break;
                    default:
                        break;
                }
                $total = $role->count();
            } else {
                $total = Role::withTrashed()->count();
            }

            $role = $role->offset(($page - 1) * $limit)
                ->limit($limit)
                ->orderBy($field, $sort);

            $role = $role->get();

            return response()->json([
                'success'   => true,
                'data'      => $role,
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
     * Get list of privileges
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
                    'privileges' => $this->privilegeList(),
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
     * Get list of privileges
     *
     * @return array
     */
    public function privilegeList()
    {
        try {
            return Privilege::select('id', 'name')->orderBy('name', 'asc')->get();
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Create new role
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function add(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'          => 'required|unique:roles',
                'description'   => 'required',
                'privileges'    => 'required|array',
                'privileges.*'  => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $role = Role::create([
                'name'          => $request->input('name'),
                'description'   => $request->input('description')
            ]);

            $arrPriv = [];
            foreach ($request->input('privileges') as $privilege) {
                array_push($arrPriv, [
                    'role_id'       => $role->id,
                    'privilege_id'  => $privilege["id"]
                ]);
            }
            $rp = RolePrivilege::insert($arrPriv);

            if ($role) {
                return response()->json([
                    'success' => true,
                    'role'    => $role,
                ], 201);
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Update a role
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'          => 'required',
                'description'   => 'required',
                'privileges'    => 'required|array',
                'privileges.*'  => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $role = Role::find($request->input('id'));
            $role->name = $request->input('name');
            $role->description = $request->input('description');
            $role->save();

            RolePrivilege::where('role_id', $request->input('id'))->delete();
            $arrPriv = [];
            foreach ($request->input('privileges') as $privilege) {
                array_push($arrPriv, [
                    'role_id'       => $role->id,
                    'privilege_id'  => $privilege["id"]
                ]);
            }
            $rp = RolePrivilege::insert($arrPriv);

            return response()->json([
                'success'   => $role,
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
     * Delete a role
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        try {
            $role = Role::find($request->input('id'))->delete();
            return response()->json([
                'success'   => $role,
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
     * Restore a role
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function restore(Request $request)
    {
        try {
            $role = Role::withTrashed()->find($request->input('id'))->restore();
            return response()->json([
                'success'   => $role,
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
