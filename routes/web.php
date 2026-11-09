<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstoqueController;
use App\Http\Controllers\FinanceiroController;

Route::get('/', fn () => redirect()->route('estoque.index'));

Route::get('/estoque', [EstoqueController::class, 'index'])->name('estoque.index');
Route::post('/estoque/movimentar', [EstoqueController::class, 'movimentar'])->name('estoque.movimentar');

Route::get('/financeiro', [FinanceiroController::class, 'index'])->name('financeiro.index');
Route::post('/financeiro/transacoes', [FinanceiroController::class, 'store'])->name('financeiro.transacoes.store');
