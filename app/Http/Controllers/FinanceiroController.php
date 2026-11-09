<?php

namespace App\Http\Controllers;

use App\Repositories\FinanceiroRepository;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FinanceiroController extends Controller
{
    public function __construct(private FinanceiroRepository $financeiro)
    {
    }

    public function index()
    {
        $categorias = $this->financeiro->categorias();
        $transacoes = $this->financeiro->transacoes();
        $resumo = $this->montarResumo($categorias, $transacoes);

        return view('financeiro.index', compact('categorias', 'transacoes', 'resumo'));
    }

    public function store(Request $request)
    {
        $categorias = $this->financeiro->categorias();

        $data = $request->validate([
            'categoria_id' => ['required', 'integer', Rule::in(array_column($categorias, 'id'))],
            'tipo' => 'required|in:despesa,receita',
            'descricao' => 'required|string|max:120',
            'valor' => 'required|numeric|min:0.01|max:99999999.99',
        ]);

        $this->financeiro->adicionarTransacao([
            ...$data,
            'categoria_id' => (int) $data['categoria_id'],
            'valor' => round((float) $data['valor'], 2),
        ]);

        $transacoes = $this->financeiro->transacoes();

        return response()->json([
            'success' => true,
            'html_resumo' => view('financeiro._resumo', ['resumo' => $this->montarResumo($categorias, $transacoes)])->render(),
            'html_transacoes' => view('financeiro._transacoes', compact('transacoes'))->render(),
        ], 201);
    }

    /**
     * Um card por categoria, mais o saldo geral.
     */
    private function montarResumo(array $categorias, array $transacoes): array
    {
        $saldo = fn (array $lista) => collect($lista)
            ->sum(fn (array $transacao) => $transacao['tipo'] === 'receita' ? $transacao['valor'] : -$transacao['valor']);

        $resumo = array_map(fn (array $categoria) => [
            'titulo' => "Total {$categoria['nome']}",
            'valor' => $saldo(array_filter($transacoes, fn (array $transacao) => $transacao['categoria_id'] === $categoria['id'])),
            'destaque' => false,
        ], $categorias);

        $resumo[] = ['titulo' => 'Saldo Líquido Geral', 'valor' => $saldo($transacoes), 'destaque' => true];

        return $resumo;
    }
}
