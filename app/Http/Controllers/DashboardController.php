<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $title = 'Dashboard';
        $breadcrumbs = [
            'heading' => 'Dashboard',
            'hierarchy' => [
                ['label' => 'Home', 'url' => route('dashboard')],
                ['label' => 'Dashboard'],
            ],
        ];

        return view('dashboard', compact('title', 'breadcrumbs'));
    }
}
