<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');

Route::middleware('auth:sanctum')->group(function () {
  Route::post('logout', [AuthController::class, 'logout']);
  Route::get('users', [UserController::class, 'fetchUsers']);
  Route::post('user/update-image', [UserController::class, 'updateImage']);
  Route::post('send-message', [ChatController::class, 'sendMessage']);
  Route::get('fetch-messages',[ChatController::class,'fetchMessages']);
  Route::patch('user/settings', [UserController::class, 'settings']);
  
});


