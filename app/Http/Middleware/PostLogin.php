<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostLogin
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check())
        {
            return $next($request);
        }
        else
        {
            if ($request->ajax())
            {
                return response()->json(['error' => 'Login session expired, please login again'], 401);
            }
            
            return redirect()->route('login');
        }
    }
}
