<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\RootController;
use Illuminate\Support\Facades\Route;

Route::get('/', RootController::class)->name('root');

Route::middleware('pre-login')->group(function ()
{
    Route::get('/login', [LoginController::class, 'login'])->name('login');
    Route::post('/login', [LoginController::class, 'login_check'])->name('login.check');
});

Route::group(['middleware' => ['post-login']], function ()
{
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/logout', LogoutController::class)->name('logout');
});