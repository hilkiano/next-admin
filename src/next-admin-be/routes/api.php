<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\PrivilegeController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MenuController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', [UserController::class, 'register'])->name('register');
Route::post('login', [UserController::class, 'login'])->name('login');

Route::group(['middleware' => 'auth.jwt'], function () use ($router) {
    $router->get('me', [UserController::class, 'me'])->name('me');
    $router->post('logout', [UserController::class, 'logout'])->name('logout');
    $router->group(['prefix' => 'user'], function () use ($router) {
        $router->get('list', [UserController::class, 'list'])->name('user.list');
        $router->post('update', [UserController::class, 'update'])->name('user.update');
        $router->post('add', [UserController::class, 'register'])->name('user.add');
        $router->post('delete', [UserController::class, 'delete'])->name('user.delete');
        $router->post('restore', [UserController::class, 'restore'])->name('user.restore');
    });
    $router->group(['prefix' => 'menu'], function () use ($router) {
        $router->get('list', [MenuController::class, 'list'])->name('menu.list');
        $router->post('add', [MenuController::class, 'add'])->name('menu.add');
        $router->post('update', [MenuController::class, 'update'])->name('menu.update');
        $router->post('delete', [MenuController::class, 'delete'])->name('menu.delete');
        $router->post('restore', [MenuController::class, 'restore'])->name('menu.restore');
    });
    $router->group(['prefix' => 'group'], function () use ($router) {
        $router->get('list', [GroupController::class, 'list'])->name('group.list');
        $router->get('dropdown_list', [GroupController::class, 'dropdownList'])->name('group.dropdown_list');
        $router->post('add', [GroupController::class, 'add'])->name('group.add');
        $router->post('update', [GroupController::class, 'update'])->name('group.update');
        $router->post('delete', [GroupController::class, 'delete'])->name('group.delete');
        $router->post('restore', [GroupController::class, 'restore'])->name('group.restore');
    });
    $router->group(['prefix' => 'role'], function () use ($router) {
        $router->get('list', [RoleController::class, 'list'])->name('role.list');
        $router->get('dropdown_list', [RoleController::class, 'dropdownList'])->name('role.dropdown_list');
        $router->post('add', [RoleController::class, 'add'])->name('role.add');
        $router->post('update', [RoleController::class, 'update'])->name('role.update');
        $router->post('delete', [RoleController::class, 'delete'])->name('role.delete');
        $router->post('restore', [RoleController::class, 'restore'])->name('role.restore');
    });
    $router->group(['prefix' => 'privilege'], function () use ($router) {
        $router->get('list', [PrivilegeController::class, 'list'])->name('privilege.list');
        $router->post('add', [PrivilegeController::class, 'add'])->name('privilege.add');
        $router->post('update', [PrivilegeController::class, 'update'])->name('privilege.update');
        $router->post('delete', [PrivilegeController::class, 'delete'])->name('privilege.delete');
        $router->post('restore', [PrivilegeController::class, 'restore'])->name('privilege.restore');
    });
});
