<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware('guest')->group(function ()
{
    Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'login'])->name('login');
    Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'loginCheck'])->name('login.check');
});

Route::middleware('auth')->group(function ()
{
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [\App\Http\Controllers\Auth\LogoutController::class, 'store'])->name('logout');
});
