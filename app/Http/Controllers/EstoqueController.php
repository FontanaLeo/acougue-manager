<?php

namespace App\Http\Controllers;

use App\Repositories\EstoqueRepository;
use Illuminate\Http\Request;

class EstoqueController extends Controller
{
    public function __construct(private EstoqueRepository $estoque)
    {
    }

    public function index()
    {
        return response()->json($this->estoque->listar());
    }

    public function movimentar(Request $request)
    {
        $data = $request->validate([
            'id'          => 'required|integer',
            'tipo'        => 'required|in:entrada,saida',
            'quantidade'  => 'required|numeric|min:0.1',
        ]);

        if (! $this->estoque->movimentar((int) $data['id'], $data['tipo'], (float) $data['quantidade'])) {
            return response()->json(['message' => 'Produto não encontrado.'], 404);
        }

        return response()->noContent();
    }
}
