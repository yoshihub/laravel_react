<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Response;
use App\Http\Controllers\TodoController;

Route::prefix('todos')->group(function () {
    Route::get('/', [TodoController::class, 'index']);
    Route::get('/{todoId}', [TodoController::class, 'show']);
    Route::post('/', [TodoController::class, 'store']);
    Route::put('/{todoId}', [TodoController::class, 'update']);
    Route::delete('/{todoId}', [TodoController::class, 'destroy']);
});
