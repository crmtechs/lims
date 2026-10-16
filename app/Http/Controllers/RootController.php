<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class RootController extends Controller
{
    public function __invoke()
    {
        if (Auth::check())
        {
            // echo '<pre>';
            // print_r(session()->all());
            // print_r(Auth::user()->toArray());
            // echo Auth::user()->full_name() . PHP_EOL;
            // echo '</pre>';
            // die;

            return redirect()->route('dashboard');
        }
        else
        {
            return redirect()->route('login');
        }
    }
}
