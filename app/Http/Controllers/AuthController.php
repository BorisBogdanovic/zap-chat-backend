<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\ResetPasswordRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;

class AuthController extends Controller
{

//////////////////////////////////////////////////////////////////////////////LOGIN
public function login(LoginUserRequest $request){

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
            'status'  => 'error',
            'message' => 'The provided credentials are incorrect.',
        ], 401);
    }

    $user = Auth::user();

    return response()->json([
        'status'     => 'success',
        'message'    => 'Welcome ' . $user->name . ' ' . $user->last_name,
        'data'       => [
            'id'         => $user->id,
            'name'       => $user->name,
            'last_name'  => $user->last_name,
            'email'      => $user->email,
            'image_path' => $user->image_path,
            'username'   => $user->username,
        ],
        'auth_token' => $user->createToken('auth_token')->plainTextToken,
    ], 200);
}
//////////////////////////////////////////////////////////////////////////////LOGOUT
public function logout(){

    Auth::user()->tokens()->delete();

        return response()->json([
            'status' => 'success', 
            'message' => 'The user has been successfully logged out'
        ], 200);
}
//////////////////////////////////////////////////////////////////////////////FORGOT-PASSWORD
public function forgotPassword(ForgotPasswordRequest $request){
    Password::sendResetLink($request->only('email'));
    
    return response()->json([
        'status' => true,
        'status' => 'If your email exists in our system, you will receive a reset link shortly.'
    ], 200);
}
//////////////////////////////////////////////////////////////////////////////RESET PASSWORD
public function resetPassword(ResetPasswordRequest $request){
    $status = Password::reset(
        $request->only('email', 'password', 'token'),
        function ($user) use ($request) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
            $user->save();
        }
    );
if ($status === Password::PASSWORD_RESET) {
        return response()->json([
            'message' => 'Password reset successfully'
        ], 200);
    }

    return response()->json([
        'message' => 'Password reset failed',
        'error_code' => $status
    ], 422);
}
//////////////////////////////////////////////////////////////////////////////REGISTER
public function register(RegisterUserRequest $request){
    
    $user=User::create([
        'name'=>$request->name,
        'last_name'=>$request->last_name,
        'email'=>$request->email,
        'password'=>Hash::make($request->password),
        'username'=>$request->username
    ]);

    return response()->json([
        'status'  => true,
        'message' => 'User registered successfully.',
        'data'    => $user
    ], 201);
}



   
}
