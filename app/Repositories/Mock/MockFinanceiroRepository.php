<?php

namespace App\Repositories\Mock;

use App\Repositories\FinanceiroRepository;
use Illuminate\Support\Facades\Cache;

class MockFinanceiroRepository implements FinanceiroRepository
{
    // O cache guarda só os lançamentos novos, para que uma linha nova no JSON vire card na hora.
    private const CHAVE_CACHE = 'mock.financeiro.transacoes_adicionadas';

    public function categorias(): array
    {
        return $this->lerMock('categorias');
    }

    public function transacoes(): array
    {
        $categorias = array_column($this->categorias(), null, 'id');
        $transacoes = array_map(
            fn (array $transacao) => [...$transacao, 'categoria' => $categorias[$transacao['categoria_id']]],
            [...$this->lerMock('transacoes'), ...Cache::get(self::CHAVE_CACHE, [])],
        );

        usort($transacoes, fn (array $a, array $b) => [$b['data'], $b['id']] <=> [$a['data'], $a['id']]);

        return $transacoes;
    }

    public function adicionarTransacao(array $dados): void
    {
        $adicionadas = Cache::get(self::CHAVE_CACHE, []);
        $adicionadas[] = [
            'id' => (int) (microtime(true) * 1000),
            ...$dados,
            'data' => now()->toDateString(),
        ];

        Cache::put(self::CHAVE_CACHE, $adicionadas, now()->addDay());
    }

    private function lerMock(string $tabela): array
    {
        return json_decode(file_get_contents(database_path("mock/{$tabela}.json")), true, 512, JSON_THROW_ON_ERROR);
    }
}
