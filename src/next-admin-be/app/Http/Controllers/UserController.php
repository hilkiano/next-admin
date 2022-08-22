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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use App\Http\Controllers\MenuController;
use Illuminate\Support\Facades\Cookie;

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
            if (Redis::get('userinfo_' . $user->id)) {
                $userInfo = json_decode(Redis::get('userinfo_' . $user->id));
            } else {
                list($groups, $roles, $privileges, $menus) = $this->getUserInfo($user);
                $userInfo = [
                    'user'          => $user,
                    'group'         => $groups,
                    'roles'         => $this->my_array_unique($roles),
                    'privileges'    => $this->my_array_unique($privileges),
                    'menus'         => $menus
                ];
                Redis::set('userinfo_' . $user->id, json_encode($userInfo));
            }

            return response()->json($userInfo, 200);
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
        // Request validator
        $validator = Validator::make($request->all(), [
            'username'  => 'required',
            'password'  => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        // Check user
        $credentials = $request->only('username', 'password');
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => trans("message.username_password_mismatch")
            ], 401);
        }
        // Delete user old cache
        $user = auth()->user();
        Redis::del('userinfo_' . $user->id);
        // Get user info
        list($groups, $roles, $privileges, $menus) = $this->getUserInfo($user);
        $cookie = cookie('jwt', $token, config('jwt.ttl'), '/');
        // Return user data with cookie
        return response()->json([
            'success'       => true,
            'user'          => $user,
            'group'         => $groups,
            'roles'         => $this->my_array_unique($roles),
            'privileges'    => $this->my_array_unique($privileges),
            'menus'         => $menus,
        ], 200)->cookie($cookie);
    }

    /**
     * Handle logout request
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $user = auth()->user();
        Redis::del('userinfo_' . $user->id);
        $cookie = Cookie::forget("jwt");

        $removeToken = JWTAuth::invalidate(JWTAuth::getToken());

        if ($removeToken) {
            return response()->json([
                'success' => true,
                'message' => 'You are logged out.',
            ])->cookie($cookie);
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

            $user = User::withTrashed()->with('groups.group');

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

    /**
     * Update user display name and picture
     *
     * @param  mixed $request
     * @return void
     */
    public function updateInfo(Request $request)
    {
        try {
            $rules = [
                "name"  => "required"
            ];
            if ($request->hasFile('img')) {
                $rules['img'] = 'mimes:jpeg,jpg,png|max:3000';
            }
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $id = $request->input('id');
            $name = $request->input('name');

            $user = User::find($id);
            $user->name = $name;

            if ($request->hasFile('img')) {
                $files = Storage::disk("public")->allFiles();
                foreach ($files as $file) {
                    if (Str::startsWith($file, 'user_image/' . $user->username)) {
                        Storage::disk('public')->delete($file);
                    }
                }
                $image = $request->file('img');
                $fileName = $user->username . '_' . time() . '.' . $image->getClientOriginalExtension();
                $path = $request->file('img')->storeAs(
                    'user_image',
                    $fileName,
                    'public'
                );

                $user->avatar_url = 'storage/user_image/' . $fileName;
            }

            $user->save();

            $cache = Redis::keys('*userinfo_' . $user->id);
            if (count($cache) > 0) {
                Redis::del('userinfo_' . $user->id);
            }

            return response()->json([
                'success'   => true,
                'user'      => $user,
                'message'   => 'Your info updated'
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
