<?php

use Illuminate\Support\Facades\Route;

Route::get('/', \App\Http\Controllers\RootController::class)->name('root');

Route::middleware('pre-login')->group(function ()
{
    Route::get('/login', [\App\Http\Controllers\LoginController::class, 'login'])->name('login');
    Route::post('/login', [\App\Http\Controllers\LoginController::class, 'login_check'])->name('login.check');
});

Route::group(['middleware' => ['post-login']], function ()
{
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/logout', \App\Http\Controllers\LogoutController::class)->name('logout');
});