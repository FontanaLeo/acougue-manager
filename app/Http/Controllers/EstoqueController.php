<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EstoqueController extends Controller
{
    private function mockBase(): array
    {
        return [
            ['id'=>1,'nome'=>'Alcatra','kg'=>25.5,'preco_kg'=>42.90,'fornecedor'=>'Frigorífico Boi Forte','estoque_minimo'=>10],
            ['id'=>2,'nome'=>'Picanha','kg'=>8.2,'preco_kg'=>69.90,'fornecedor'=>'Frigorífico Boi Forte','estoque_minimo'=>10],
            ['id'=>3,'nome'=>'Patinho','kg'=>30.0,'preco_kg'=>32.50,'fornecedor'=>'Agropecuária Silva','estoque_minimo'=>15],
            ['id'=>4,'nome'=>'Linguiça','kg'=>18.0,'preco_kg'=>24.90,'fornecedor'=>'Casa de Carnes Central','estoque_minimo'=>20],
            ['id'=>5,'nome'=>'Costela','kg'=>12.4,'preco_kg'=>36.00,'fornecedor'=>'Frigorífico Boi Forte','estoque_minimo'=>10],
        ];
    }

    private function getEstoque(): array
    {
        return session('estoque', $this->mockBase());
    }

    public function index()
    {
        return view('estoque.index', ['itens' => $this->getEstoque()]);
    }

    public function movimentar(Request $request)
    {
        $data = $request->validate([
            'id'          => 'required|integer',
            'tipo'        => 'required|in:entrada,saida',
            'quantidade'  => 'required|numeric|min:0.1',
        ]);

        $itens = $this->getEstoque();
        foreach ($itens as &$item) {
            if ($item['id'] == $data['id']) {
                $item['kg'] = $data['tipo'] === 'entrada'
                    ? round($item['kg'] + $data['quantidade'], 2)
                    : round(max(0, $item['kg'] - $data['quantidade']), 2);
            }
        }
        unset($item);
        session(['estoque' => $itens]);

        return response()->json(['success' => true, 'itens' => $itens]);
    }
}
