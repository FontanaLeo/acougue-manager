<?php

namespace App\Repositories;

interface EstoqueRepository
{
    /**
     * @return list<array{id: int, nome: string, kg: float, preco_kg: float, fornecedor: string, estoque_minimo: float}>
     */
    public function listar(): array;

    /**
     * @return bool false quando o produto não existe
     */
    public function movimentar(int $id, string $tipo, float $quantidade): bool;
}
