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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ConfigsController;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\ActivityLogController;

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
        // Define form validation rules
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'username'  => 'required|unique:users',
            'password'  => 'required|min:8|confirmed',
            'email'     => 'email:rfc,dns'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        // Create new user
        $user = User::create([
            'name'      => $request->name,
            'username'  => $request->username,
            'password'  => Hash::make($request->password),
            'email'     => $request->email
        ]);
        // Return response
        if ($user) {
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.add_user'), true);
            return response()->json([
                'success' => true,
                'user'    => $user,
            ], 201);
        }
        $activityLog = new ActivityLogController();
        $activityLog->create($user->id, config('constants.activity-log.add_user'), false);
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
        // Check authenticated user
        if (auth()->user()) {
            $user = auth()->user();
            // Check Redis cache
            if (Redis::get('userinfo_' . $user->id)) {
                $userInfo = json_decode(Redis::get('userinfo_' . $user->id));
            } else {
                list($groups, $roles, $privileges, $menus, $configs) = $this->getUserInfo($user);
                $userInfo = [
                    'user'          => $user,
                    'group'         => $groups,
                    'roles'         => $this->my_array_unique($roles),
                    'privileges'    => $this->my_array_unique($privileges),
                    'menus'         => $menus,
                    'configs'       => $configs
                ];
                Redis::set('userinfo_' . $user->id, json_encode($userInfo));
            }
            // Return response
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
        // Get user groups and roles
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
        // Get menu list from user's privileges
        $menuController = new MenuController();
        $menus = $menuController->generateMenu($this->my_array_unique($privileges));
        // Get configs
        $configController = new ConfigsController();
        $configs = $configController->retrieveList();
        // Return array of user info
        return array($groups, $roles, $privileges, $menus, $configs);
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
        // Record activity and return user information
        $activityLog = new ActivityLogController();
        $activityLog->create($user->id, config('constants.activity-log.login'), true);
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
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        $user = auth()->user();
        Redis::del('userinfo_' . $user->id);
        $cookie = Cookie::forget("jwt");

        $removeToken = JWTAuth::invalidate(JWTAuth::getToken());

        if ($removeToken) {
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.logout'), true);
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
            // Define form validation rules
            $rules = [];
            $rules['email'] = 'required|email:rfc,dns';
            $rules['name'] = 'required';
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
            // Find user by ID, then update its information
            $user = User::find($request->input('id'));
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->save();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.update_user'), true);
            return response()->json([
                'success'   => $user,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.update_user'), false);
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
            // Delete user by ID
            $user = User::find($request->input('id'))->delete();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.delete_user'), true);
            return response()->json([
                'success'   => $user,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.delete_user'), true);
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
            // Restore user by ID
            $user = User::withTrashed()->find($request->input('id'))->restore();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.restore_user'), true);
            return response()->json([
                'success'   => $user,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.restore_user'), false);
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
            // Define form validation rules
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
            // Request variables
            $id = $request->input('id');
            $name = $request->input('name');
            // Select user by requested id
            $user = User::find($id);
            $user->name = $name;
            // Process requested avatar image
            if ($request->hasFile('img')) {
                // Iterate all files in user_image directory, delete old user image if exists
                $files = Storage::disk("public")->allFiles('user_image');
                foreach ($files as $file) {
                    if (Str::startsWith($file, 'user_image/' . $user->username)) {
                        Storage::disk('public')->delete($file);
                    }
                }
                // Store new image
                $image = $request->file('img');
                $fileName = $user->username . '_' . time() . '.' . $image->getClientOriginalExtension();
                $request->file('img')->storeAs(
                    'user_image',
                    $fileName,
                    'public'
                );

                $user->avatar_url = 'storage/user_image/' . $fileName;
            }
            $user->save();
            // Delete user info cache
            $cache = Redis::keys('*userinfo_' . $user->id);
            if (count($cache) > 0) {
                Redis::del('userinfo_' . $user->id);
            }
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.update_user_info'), true);
            return response()->json([
                'success'   => true,
                'user'      => $user,
                'message'   => 'Your info updated'
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create($user->id, config('constants.activity-log.update_user_info'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }
}
