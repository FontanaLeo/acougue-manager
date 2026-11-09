@extends('layouts.app')
@section('titulo', 'Financeiro')
@section('page', 'financeiro')

@section('conteudo')
<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
    <h1 class="text-2xl font-bold text-gray-800">Gestão Financeira Unificada</h1>
    <button id="btnNovaTransacao" type="button" class="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900">
        <span aria-hidden="true">+</span> Novo lançamento
    </button>
</div>

<div id="resumoFinanceiro" class="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4 mb-6">
    @include('financeiro._resumo')
</div>

<div class="flex flex-wrap gap-2 mb-3" id="filtros">
    <button data-filtro="todos" class="btn-filtro bg-red-800 text-white px-3 py-1 rounded-full text-sm">Todos</button>
    @foreach ($categorias as $categoria)
        <button data-filtro="{{ $categoria['id'] }}" class="btn-filtro bg-white border px-3 py-1 rounded-full text-sm">{{ $categoria['nome'] }}</button>
    @endforeach
</div>

<div id="listaTransacoes" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    @include('financeiro._transacoes')
</div>
<p id="semResultados" class="hidden text-center text-gray-500 py-8">Nenhum lançamento nesta categoria.</p>

<div id="modalTransacao" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="tituloModalTransacao">
    <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
            <h2 id="tituloModalTransacao" class="text-lg font-bold text-gray-800">Novo lançamento</h2>
            <button id="btnFecharTransacao" type="button" aria-label="Fechar" class="rounded p-2 text-gray-500 hover:bg-gray-100">&times;</button>
        </div>
        <form id="formTransacao" class="space-y-4">
            <p id="erroTransacao" class="hidden text-sm text-red-700" role="alert"></p>
            <label class="block text-sm font-medium text-gray-700">
                Tipo
                <select name="tipo" required class="mt-1 w-full rounded-lg border border-gray-300 p-2.5">
                    <option value="despesa">Gasto / despesa</option>
                    <option value="receita">Venda / entrada de dinheiro</option>
                </select>
            </label>
            <label class="block text-sm font-medium text-gray-700">
                Categoria
                <select name="categoria_id" required class="mt-1 w-full rounded-lg border border-gray-300 p-2.5">
                    @foreach ($categorias as $categoria)
                        <option value="{{ $categoria['id'] }}">{{ $categoria['nome'] }}</option>
                    @endforeach
                </select>
            </label>
            <label class="block text-sm font-medium text-gray-700">
                Descrição
                <input name="descricao" type="text" maxlength="120" required placeholder="Ex.: Venda no balcão" class="mt-1 w-full rounded-lg border border-gray-300 p-2.5">
            </label>
            <label class="block text-sm font-medium text-gray-700">
                Valor (R$)
                <input name="valor" type="number" min="0.01" step="0.01" required placeholder="0,00" class="mt-1 w-full rounded-lg border border-gray-300 p-2.5">
            </label>
            <div class="flex justify-end gap-2 pt-2">
                <button id="btnCancelarTransacao" type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" class="rounded-lg bg-red-800 px-4 py-2 text-white hover:bg-red-900">Adicionar</button>
            </div>
        </form>
    </div>
</div>
@endsection
