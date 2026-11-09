<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstoqueController;
use App\Http\Controllers\FinanceiroController;

Route::redirect('/', '/estoque');

// Telas: o Laravel entrega só a página base e o React monta o conteúdo.
Route::view('/estoque', 'app');
Route::view('/financeiro', 'app');

// A API fica no grupo web porque usa a sessão e o token CSRF da página.
Route::prefix('api')->group(function () {
    Route::get('/estoque', [EstoqueController::class, 'index']);
    Route::post('/estoque/movimentar', [EstoqueController::class, 'movimentar']);

    Route::get('/categorias', [FinanceiroController::class, 'categorias']);
    Route::get('/transacoes', [FinanceiroController::class, 'transacoes']);
    Route::post('/transacoes', [FinanceiroController::class, 'store']);
});
