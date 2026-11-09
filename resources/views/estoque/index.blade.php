@extends('layouts.app')
@section('titulo', 'Estoque')
@section('page', 'estoque')

@section('conteudo')
<div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
    <button id="btnAbrirModal" class="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900">
        + Movimentar Estoque
    </button>
</div>

<div id="gridEstoque" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    @include('estoque._cards')
</div>

{{-- Modal --}}
<div id="modalMovimentar" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold mb-4">Movimentar Estoque</h3>
        <form id="formMovimentar" class="space-y-3">
            <p id="erroMovimentar" class="hidden text-sm text-red-700" role="alert"></p>
            <select name="id" class="w-full border rounded-lg p-2">
                @foreach ($itens as $item)
                    <option value="{{ $item['id'] }}">{{ $item['nome'] }}</option>
                @endforeach
            </select>
            <select name="tipo" class="w-full border rounded-lg p-2">
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
            </select>
            <input type="number" step="0.1" name="quantidade" placeholder="Quantidade (kg)" required
                   class="w-full border rounded-lg p-2">
            <div class="flex justify-end gap-2 pt-2">
                <button type="button" id="btnFecharModal" class="px-4 py-2 rounded-lg border">Cancelar</button>
                <button type="submit" class="px-4 py-2 rounded-lg bg-red-800 text-white">Confirmar</button>
            </div>
        </form>
    </div>
</div>
@endsection
