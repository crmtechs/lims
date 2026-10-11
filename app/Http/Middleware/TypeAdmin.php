<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TypeAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if(Auth::check() && in_array(Auth::user()->user_type, ['super', 'admin']))
        {
            return $next($request);
        }
        else
        {
            return redirect()->route('login');
        }
    }
}
