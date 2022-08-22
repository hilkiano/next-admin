<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class LanguageMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $configs = Redis::get("configs");
        if ($configs) {
            $decoded = json_decode($configs);
            $lang = array_filter($decoded, function ($obj) {
                return ($obj->name === "app.language") ? true : false;
            });
            $language = $lang[0]->value;
            App::setLocale($language);
        } else {
            App::setLocale("en");
        }

        return $next($request);
    }
}
