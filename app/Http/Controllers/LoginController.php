<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login()
    {
        $title = 'Sign In';

        return view('login', compact('title'));
    }

    public function login_check(Request $request)
    {
        $return = [];
        $username = $request->username;
        $password = $request->password;

        if (empty($username) || empty($password))
        {
            $return['status'] = 'error';
            $return['error_code'] = 'empty_credentials';
            $return['error_message'] = 'Empty username or password';
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
                        $return['error_code'] = 'user_inactive';
                        $return['error_message'] = 'User is inactive';
                    }
                    else
                    {
                        $valid_until = config('license.valid_until');
                        $allowed_users = config('license.allowed_users', []);

                        if ($valid_until && now()->greaterThan($valid_until) && !in_array($user->uuid, $allowed_users))
                        {
                            $return['status'] = 'error';
                            $return['error_code'] = 'software_license_expired';
                            $return['error_message'] = 'Software license expired';
                        }
                        else
                        {
                            $remember = $request->boolean('remember');

                            Auth::login($user, $remember);

                            $request->session()->regenerate();
                            $return['status'] = 'success';

                            $return['redirect'] = route('dashboard');
                        }
                    }
                }
                else
                {
                    $return['status'] = 'error';
                    $return['error_code'] = 'password_does_not_match';
                    $return['error_message'] = 'Password does not match';
                }
            }
            else
            {
                $return['status'] = 'error';
                $return['error_code'] = 'username_does_not_exist';
                $return['error_message'] = 'Username does not exist';
            }
        }

        return response()->json($return);
    }
}
