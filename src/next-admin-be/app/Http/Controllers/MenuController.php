<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

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
        $validator = Validator::make($request->all(), [
            'name'      => 'required|unique:menus',
            'label'     => 'required',
            'icon'      => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $createArr = [
            'name'      => $request->name,
            'label'     => $request->label,
            'is_parent' => $request->is_parent,
            'icon'      => $request->icon,
            'url'       => $request->url
        ];
        if ($request->has('parent')) {
            $createArr['parent'] = $request->parent;
        }

        $menu = Menu::create($createArr);
        if ($menu) {
            return response()->json([
                'success' => true,
                'menu'    => $menu,
            ], 201);
        }

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
            $rules = [];
            $rules['name'] = 'required';
            $rules['label'] = 'required';
            $rules['icon'] = 'required';
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $menu = Menu::find($request->input('id'));
            $menu->name = $request->input('name');
            $menu->label = $request->input('label');
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

            return response()->json([
                'success'   => $menu,
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
     * Delete menu
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        try {
            $menu = Menu::find($request->input('id'))->delete();
            return response()->json([
                'success'   => $menu,
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
     * Restore menu
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function restore(Request $request)
    {
        try {
            $menu = Menu::withTrashed()->find($request->input('id'))->restore();
            return response()->json([
                'success'   => $menu,
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
     * generateMenu
     *
     * @param  mixed $privileges
     * @return void
     */
    public function generateMenu($privileges)
    {
        try {
            $menus = [];
            $allMenu = Menu::all();
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
                    "label"     => $menu->label,
                    "is_parent" => $menu->is_parent,
                    "url"       => $menu->url,
                    "icon"      => $menu->icon,
                    "child"     => $this->childMenu($menus, $menu->name)
                ]);
            } else if (empty($menu->parent)) {
                array_push($org, (object)[
                    "name"      => $menu->name,
                    "label"     => $menu->label,
                    "is_parent" => $menu->is_parent,
                    "url"       => $menu->url,
                    "icon"      => $menu->icon
                ]);
            }
        }

        return $org;
    }

    private function childMenu($menus, $parentName)
    {
        $children = [];
        foreach ($menus as $menu) {
            if ($menu->parent === $parentName) {
                array_push($children, (object)[
                    "name"      => $menu->name,
                    "label"     => $menu->label,
                    "is_parent" => $menu->is_parent,
                    "url"       => $menu->url,
                    "icon"      => $menu->icon,
                ]);
            }
        }

        return $children;
    }
}
