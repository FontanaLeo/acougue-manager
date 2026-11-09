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

    public function categorias()
    {
        return response()->json($this->financeiro->categorias());
    }

    public function transacoes()
    {
        return response()->json($this->financeiro->transacoes());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'categoria_id' => ['required', 'integer', Rule::in(array_column($this->financeiro->categorias(), 'id'))],
            'tipo' => 'required|in:despesa,receita',
            'descricao' => 'required|string|max:120',
            'valor' => 'required|numeric|min:0.01|max:99999999.99',
        ]);

        $this->financeiro->adicionarTransacao([
            ...$data,
            'categoria_id' => (int) $data['categoria_id'],
            'valor' => round((float) $data['valor'], 2),
        ]);

        return response()->noContent();
    }
}
