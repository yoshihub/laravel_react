<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Response;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\AuthController;

// 認証関連のルート（認証不要）
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 認証が必要なルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Todo関連のルート（認証必須）
    Route::prefix('todos')->group(function () {
        Route::get('/', [TodoController::class, 'index']);
        Route::get('/{todoId}', [TodoController::class, 'show']);
        Route::post('/', [TodoController::class, 'store']);
        Route::put('/{todoId}', [TodoController::class, 'update']);
        Route::delete('/{todoId}', [TodoController::class, 'destroy']);
    });
});
