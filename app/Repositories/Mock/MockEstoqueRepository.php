<?php

namespace App\Repositories\Mock;

use App\Repositories\EstoqueRepository;

class MockEstoqueRepository implements EstoqueRepository
{
    // A sessão guarda só o kg alterado, para que um produto novo no JSON vire card na hora.
    private const CHAVE_SESSAO = 'mock.estoque_kg';

    public function listar(): array
    {
        $produtos = json_decode(file_get_contents(database_path('mock/produtos.json')), true, 512, JSON_THROW_ON_ERROR);
        $kgAlterado = session(self::CHAVE_SESSAO, []);

        return array_map(
            fn (array $produto) => array_replace($produto, ['kg' => $kgAlterado[$produto['id']] ?? $produto['kg']]),
            $produtos,
        );
    }

    public function movimentar(int $id, string $tipo, float $quantidade): bool
    {
        foreach ($this->listar() as $produto) {
            if ($produto['id'] === $id) {
                $kg = $tipo === 'entrada' ? $produto['kg'] + $quantidade : max(0, $produto['kg'] - $quantidade);
                session()->put(self::CHAVE_SESSAO.'.'.$id, round($kg, 2));

                return true;
            }
        }

        return false;
    }
}
