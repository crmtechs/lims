<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login()
    {
        return view('login');
    }

    public function login_check(Request $request)
    {
        $return = [];
        $username = $request->username;
        $password = $request->password;

        if (empty($username) || empty($password))
        {
            $return['status'] = 'error';
            $return['error'] = 'empty_credentials';
        }
        else
        {
            $user = User::where('username', $username)->first();
            
            if ($user)
            {
                if (Hash::check($password, $user->password))
                {
                    if ($user->status != 'active')
                    {
                        $return['status'] = 'error';
                        $return['error'] = 'user_inactive';
                    }
                    else
                    {
                        $valid_until = config('license.valid_until');
                        $allowed_users = config('license.allowed_users', []);

                        if ($valid_until && now()->greaterThan($valid_until) && !in_array($user->uuid, $allowed_users))
                        {
                            $return['status'] = 'error';
                            $return['error'] = 'software_license_expired';
                        }
                        else
                        {
                            $remember = $request->boolean('remember');

                            Auth::login($user, $remember);
                            $request->session()->regenerate();
                            $return['status'] = 'success';
                        }
                    }
                }
                else
                {
                    $return['status'] = 'error';
                    $return['error'] = 'password_does_not_match';
                }
            }
            else
            {
                $return['status'] = 'error';
                $return['error'] = 'username_does_not_exist';
            }
        }

        return response()->json($return);
    }
}
