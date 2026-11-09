<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FinanceiroController extends Controller
{
    private const CACHE_KEY = 'financeiro.transacoes';

    private function mockTransacoes(): array
    {
        return [
            ['id'=>1,'tag'=>'Açougue','tipo'=>'despesa','desc'=>'Compra de Boi (Frigorífico)','valor'=>3200.00,'data'=>'2025-09-01'],
            ['id'=>2,'tag'=>'Açougue','tipo'=>'receita','desc'=>'Vendas no balcão','valor'=>5400.00,'data'=>'2025-09-05'],
            ['id'=>3,'tag'=>'Família','tipo'=>'despesa','desc'=>'Mercado','valor'=>680.00,'data'=>'2025-09-03'],
            ['id'=>4,'tag'=>'Açougue','tipo'=>'despesa','desc'=>'Conta de Luz do Açougue','valor'=>310.00,'data'=>'2025-09-04'],
            ['id'=>5,'tag'=>'Família','tipo'=>'despesa','desc'=>'Escola','valor'=>450.00,'data'=>'2025-09-05'],
            ['id'=>6,'tag'=>'Família','tipo'=>'receita','desc'=>'Salário extra','valor'=>1200.00,'data'=>'2025-09-02'],
            ['id'=>7,'tag'=>'Açougue','tipo'=>'despesa','desc'=>'Manutenção câmara fria','valor'=>250.00,'data'=>'2025-09-06'],
        ];
    }

    public function index()
    {
        $transacoes = Cache::remember(self::CACHE_KEY, now()->addDay(), fn () => $this->mockTransacoes());
        $totais = $this->calcularTotais($transacoes);

        return view('financeiro.index', compact('transacoes', 'totais'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tag' => 'required|in:Açougue,Família',
            'tipo' => 'required|in:despesa,receita',
            'desc' => 'required|string|max:120',
            'valor' => 'required|numeric|min:0.01|max:99999999.99',
        ]);

        $transacoes = Cache::remember(self::CACHE_KEY, now()->addDay(), fn () => $this->mockTransacoes());
        $transacoes[] = [
            'id' => (int) (microtime(true) * 1000),
            ...$data,
            'valor' => round((float) $data['valor'], 2),
            'data' => now()->toDateString(),
        ];

        Cache::put(self::CACHE_KEY, $transacoes, now()->addDay());

        return response()->json([
            'success' => true,
            'transacao' => end($transacoes),
            'totais' => $this->calcularTotais($transacoes),
        ], 201);
    }

    private function calcularTotais(array $transacoes): array
    {
        $soma = fn (string $tag) => collect($transacoes)
            ->where('tag', $tag)
            ->sum(fn ($transacao) => $transacao['tipo'] === 'receita' ? $transacao['valor'] : -$transacao['valor']);

        $totais = [
            'acougue' => $soma('Açougue'),
            'familia' => $soma('Família'),
        ];
        $totais['saldo'] = $totais['acougue'] + $totais['familia'];

        return $totais;
    }
}
