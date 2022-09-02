<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\ActivityLogController;

class MenuController extends Controller
{
    /**
     * Get menus from model
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

            $menu = Menu::withTrashed();

            if ($filterField && $filterMode && $filterValue) {
                switch ($filterMode) {
                    case 'contains':
                        $menu = $menu->where($filterField, 'LIKE', '%' . $filterValue . '%');
                        break;
                    case 'equals':
                        $menu = $menu->where($filterField, '=', $filterValue);
                        break;
                    case 'startsWith':
                        $menu = $menu->where($filterField, 'LIKE', $filterValue . '%');
                        break;
                    case 'endsWith':
                        $menu = $menu->where($filterField, 'LIKE', '%' . $filterValue);
                        break;
                    case 'is':
                        $menu = $menu->where($filterField, ($filterValue === 'true') ? true : false);
                        break;
                    default:
                        break;
                }
                $total = $menu->count();
            } else {
                $total = Menu::withTrashed()->count();
            }

            $menu = $menu->offset(($page - 1) * $limit)
                ->limit($limit)
                ->orderBy($field, $sort);

            $menu = $menu->get();

            return response()->json([
                'success'   => true,
                'data'      => $menu,
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
     * Handle menu registration
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function add(Request $request)
    {
        // Define form validation rules
        $validator = Validator::make($request->all(), [
            'name'      => 'required|unique:menus',
            'order'     => 'required',
            'icon'      => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        // Create new menu
        $createArr = [
            'name'      => $request->name,
            'order'     => $request->order,
            'is_parent' => $request->is_parent,
            'icon'      => $request->icon,
            'url'       => $request->url
        ];
        if ($request->has('parent')) {
            $createArr['parent'] = $request->parent;
        }

        $menu = Menu::create($createArr);
        if ($menu) {
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.add_menu'), true);
            return response()->json([
                'success' => true,
                'menu'    => $menu,
            ], 201);
        }
        // Return response
        $activityLog = new ActivityLogController();
        $activityLog->create(auth()->user()->id, config('constants.activity-log.add_menu'), false);
        return response()->json([
            'success' => false,
        ], 409);
    }

    /**
     * Update menu model
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        try {
            // Define form validation rules
            $rules = [];
            $rules['name'] = 'required';
            $rules['order'] = 'required';
            $rules['icon'] = 'required';
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
            // Find menu by ID and update its information
            $menu = Menu::find($request->input('id'));
            $menu->name = $request->input('name');
            $menu->order = $request->input('order');
            if ($request->has('is_parent')) {
                $menu->is_parent = $request->input('is_parent');
            }
            $menu->icon = $request->input('icon');
            if ($request->has('parent')) {
                $menu->parent = $request->input('parent');
            }
            if ($request->has('url')) {
                $menu->url = $request->input('url');
            }
            $menu->save();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.update_menu'), true);
            return response()->json([
                'success'   => $menu,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.update_menu'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Delete menu
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        try {
            // Delete menu by ID
            $menu = Menu::find($request->input('id'))->delete();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.delete_menu'), true);
            return response()->json([
                'success'   => $menu,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.delete_menu'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Restore menu
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function restore(Request $request)
    {
        try {
            // Restore menu by ID
            $menu = Menu::withTrashed()->find($request->input('id'))->restore();
            // Return response
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.restore_menu'), true);
            return response()->json([
                'success'   => $menu,
                'message'   => ''
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $activityLog = new ActivityLogController();
            $activityLog->create(auth()->user()->id, config('constants.activity-log.restore_menu'), false);
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }

    /**
     * Generate list of menu based on user's privileges
     *
     * @param  mixed $privileges
     * @return void
     */
    public function generateMenu($privileges)
    {
        try {
            $menus = [];
            $allMenu = Menu::all();
            // Filter user privileges with name contains PAGE
            $pagePrivs = array_filter($privileges, function ($obj) {
                if (isset($obj->name)) {
                    if (str_contains('PAGE_', $obj->name)) return false;
                }
                return true;
            });

            foreach ($pagePrivs as $page) {
                // Get associated menu
                foreach ($allMenu as $menu) {
                    if ($menu->name === strtolower(str_replace('PAGE_', '', $page->name))) {
                        array_push($menus, $menu);
                    }
                }
            }

            $menus = $this->organizeMenu($menus);
            return $menus;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'success'   => false,
                'message'   => 'Something wrong happened. Try again later.'
            ], 400);
        }
    }


    /**
     * Organize menu.
     *
     * @param  mixed $menus
     * @return void
     */
    private function organizeMenu($menus)
    {
        $org = [];
        foreach ($menus as $menu) {
            if ($menu->is_parent) {
                array_push($org, (object)[
                    "name"      => $menu->name,
                    "label"     => trans("menu.{$menu->name}"),
                    "order"     => $menu->order,
                    "is_parent" => $menu->is_parent,
                    "url"       => $menu->url,
                    "icon"      => $menu->icon,
                    "child"     => $this->childMenu($menus, $menu->name)
                ]);
            } else if (empty($menu->parent)) {
                array_push($org, (object)[
                    "name"      => $menu->name,
                    "label"     => trans("menu.{$menu->name}"),
                    "order"     => $menu->order,
                    "is_parent" => $menu->is_parent,
                    "url"       => $menu->url,
                    "icon"      => $menu->icon
                ]);
            }
        }

        $sorted = collect($org)->sortBy('order')->toArray();
        return $sorted;
    }

    private function childMenu($menus, $parentName)
    {
        $children = [];
        foreach ($menus as $menu) {
            if ($menu->parent === $parentName) {
                array_push($children, (object)[
                    "name"      => $menu->name,
                    "label"     => trans("menu.{$menu->name}"),
                    "order"     => $menu->order,
                    "is_parent" => $menu->is_parent,
                    "url"       => $menu->url,
                    "icon"      => $menu->icon,
                ]);
            }
        }

        $sorted = collect($children)->sortBy('order')->toArray();
        return $sorted;
    }
}
