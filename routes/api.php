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
  Route::post('user/avatar', [UserController::class, 'updateImage']);
  Route::patch('user/settings', [UserController::class, 'settings']);
  Route::post('send-message', [ChatController::class, 'store']);
  Route::get('fetch-messages',[ChatController::class,'fetchMessages']);
  Route::post('user/typing', [ChatController::class, 'userTyping']);
  Route::delete('user/delete/{user}', [UserController::class, 'userDelete']);
  Route::patch('user/{user}/edit', [UserController::class, 'editUsername']);
  });


