<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TypeSuper
{
    public function handle(Request $request, Closure $next)
    {
        if(Auth::check() && in_array(Auth::user()->user_type, ['super']))
        {
            return $next($request);
        }
        else
        {
            return redirect()->route('login');
        }
    }
}
