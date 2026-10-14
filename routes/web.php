<?php

use App\Http\Controllers\Core\DisciplineController;
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

    Route::prefix('core')->name('core.')->group(function ()
    {
        Route::prefix('disciplines')->name('disciplines.')->group(function ()
        {
            Route::get('/', [DisciplineController::class, 'index'])->name('index');
            Route::post('/data', [DisciplineController::class, 'data'])->name('data');
            Route::get('/create', [DisciplineController::class, 'create'])->name('create');
            Route::post('/', [DisciplineController::class, 'store'])->name('store');
            Route::get('/{uuid}', [DisciplineController::class, 'show'])->name('show');
            Route::get('/{uuid}/edit', [DisciplineController::class, 'edit'])->name('edit');
            Route::post('/{uuid}', [DisciplineController::class, 'update'])->name('update');
            Route::post('/{uuid}/delete', [DisciplineController::class, 'delete'])->name('delete');
        });
    });
});
