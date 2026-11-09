<?php

namespace App\Repositories;

interface FinanceiroRepository
{
    /**
     * @return list<array{id: int, nome: string, cor: string}>
     */
    public function categorias(): array;

    /**
     * Transações da mais recente para a mais antiga, cada uma com sua categoria em "categoria".
     *
     * @return list<array{id: int, categoria_id: int, tipo: string, descricao: string, valor: float, data: string, categoria: array{id: int, nome: string, cor: string}}>
     */
    public function transacoes(): array;

    /**
     * @param  array{categoria_id: int, tipo: string, descricao: string, valor: float}  $dados
     */
    public function adicionarTransacao(array $dados): void;
}
