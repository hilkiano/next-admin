<?php

namespace App\Http\Controllers;

use App\Models\GroupRole;
use App\Models\GroupUser;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\MenuController;

class UserController extends Controller
{

    /**
     * Handle user registration
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'username'  => 'required|unique:users',
            'password'  => 'required|min:8|confirmed',
            'email'     => 'email:rfc,dns'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name'      => $request->name,
            'username'  => $request->username,
            'password'  => Hash::make($request->password),
            'email'     => $request->email
        ]);
        if ($user) {
            return response()->json([
                'success' => true,
                'user'    => $user,
            ], 201);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }

    /**
     * Get logged in user information
     *
     * @return \Illuminate\Http\Response
     */
    public function me()
    {
        if (auth()->user()) {
            $user = auth()->user();
            list($groups, $roles, $privileges, $menus) = $this->getUserInfo($user);

            return response()->json([
                'user'          => $user,
                'group'         => $groups,
                'roles'         => $this->my_array_unique($roles),
                'privileges'    => $this->my_array_unique($privileges),
                'menus'         => $menus
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Not authenticated attempt.'
            ], 401);
        }
    }

    /**
     * Get user informations
     *
     * @param  object $user
     * @return array
     */
    private function getUserInfo($user)
    {
        $groups = [];
        $roles = [];
        $privileges = [];

        $groups = GroupUser::with('group')->where('user_id', $user->id)->get()->pluck('group');
        foreach ($groups as $group) {
            $gr = GroupRole::with('role')->where('group_id', $group->id)->get()->pluck('role');
            if ($gr) {
                foreach ($gr as $role) {
                    array_push($roles, $role);
                }
            }
        }
        foreach ($roles as $role) {
            $rp = Role::with('privileges.privilege')->where('id', $role->id)->get()->pluck('privileges');
            if ($rp) {
                foreach ($rp as $privilege) {
                    foreach ($privilege as $priv) {
                        array_push($privileges, $priv->privilege);
                    };
                }
            }
        }
        $menuController = new MenuController();
        $menus = $menuController->generateMenu($this->my_array_unique($privileges));

        return array($groups, $roles, $privileges, $menus);
    }

    /**
     * Remove duplicated object from array
     *
     * @param array $array
     * @return array
     */
    private function my_array_unique($array, $keep_key_assoc = false)
    {
        $duplicate_keys = array();
        $tmp = array();

        foreach ($array as $key => $val) {
            if (is_object($val))
                $val = (array)$val;

            if (!in_array($val, $tmp))
                $tmp[] = $val;
            else
                $duplicate_keys[] = $key;
        }

        foreach ($duplicate_keys as $key)
            unset($array[$key]);

        return $keep_key_assoc ? $array : array_values($array);
    }

    /**
     * Handle login request
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username'  => 'required',
            'password'  => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $credentials = $request->only('username', 'password');
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Username or password is wrong.'
            ], 401);
        }

        list($groups, $roles, $privileges, $menus) = $this->getUserInfo(auth()->user());

        return response()->json([
            'success' => true,
            'user'    => auth()->user(),
            'group'         => $groups,
            'roles'         => $this->my_array_unique($roles),
            'privileges'    => $this->my_array_unique($privileges),
            'menus'         => $menus,
            'token'   => $token
        ], 200);
    }

    /**
     * Handle logout request
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $removeToken = JWTAuth::invalidate(JWTAuth::getToken());

        if ($removeToken) {
            return response()->json([
                'success' => true,
                'message' => 'You are logged out.',
            ]);
        }
    }

    /**
     * Get users from model
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

            $user = User::withTrashed();

            if ($filterField && $filterMode && $filterValue) {
                switch ($filterMode) {
                    case 'contains':
                        $user = $user->where($filterField, 'LIKE', '%' . $filterValue . '%');
                        break;
                    case 'equals':
                        $user = $user->where($filterField, '=', $filterValue);
                        break;
                    case 'startsWith':
                        $user = $user->where($filterField, 'LIKE', $filterValue . '%');
                        break;
                    case 'endsWith':
                        $user = $user->where($filterField, 'LIKE', '%' . $filterValue);
                        break;
                    default:
                        break;
                }
                $total = $user->count();
            } else {
                $total = User::withTrashed()->count();
            }

            $user = $user->offset(($page - 1) * $limit)
                ->limit($limit)
                ->orderBy($field, $sort);

            $user = $user->get();

            return response()->json([
                'success'   => true,
                'data'      => $user,
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
     * Update user model
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        try {
            $rules = [];
            $rules['email'] = 'required|email:rfc,dns';
            $rules['name'] = 'required';
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $user = User::find($request->input('id'));
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->save();

            return response()->json([
                'success'   => $user,
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
     * Delete user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        try {
            $user = User::find($request->input('id'))->delete();
            return response()->json([
                'success'   => $user,
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
     * Restore user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function restore(Request $request)
    {
        try {
            $user = User::withTrashed()->find($request->input('id'))->restore();
            return response()->json([
                'success'   => $user,
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
