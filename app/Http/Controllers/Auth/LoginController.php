<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login()
    {
        return view('auth.login');
    }

    public function loginCheck(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        if (empty($username) || empty($password))
        {
            throw ValidationException::withMessages([
                'username' => 'Empty username or password'
            ]);
        }

        $user = User::where('username', $username)->first();
        if (!$user)
        {
            throw ValidationException::withMessages([
                'username' => 'Username does not exist'
            ]);
        }

        if (!Hash::check($password, $user->password))
        {
            throw ValidationException::withMessages([
                'password' => 'Password does not match'
            ]);
        }

        if ($user->status != 'active')
        {
            throw ValidationException::withMessages([
                'username' => 'Account inactive, contact administrator'
            ]);
        }

        $valid_until = config('license.valid_until');
        $allowed_users = config('license.allowed_users', []);

        if ($valid_until && now()->greaterThan($valid_until))
        {
            if (!in_array($user->uuid, $allowed_users))
            {
                throw ValidationException::withMessages([
                    'username' => 'Software license expired'
                ]);
            }
        }

        $remember = $request->boolean('remember');

        if (Auth::attempt(['username' => $username, 'password' => $password], $remember))
        {
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'));
        }

        throw ValidationException::withMessages([
            'username' => trans('auth.failed'),
        ]);
    }
}
