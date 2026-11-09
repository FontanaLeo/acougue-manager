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

<div class="grid sm:grid-cols-3 gap-4 mb-6">
    <div class="bg-white rounded-xl shadow p-4">
        <p class="text-gray-500 text-sm">Total Açougue</p>
        <p id="saldoAcougue" data-value="{{ $totais['acougue'] }}" class="text-2xl font-bold {{ $totais['acougue'] >= 0 ? 'text-green-700' : 'text-red-700' }}">
            R$ {{ number_format($totais['acougue'], 2, ',', '.') }}
        </p>
    </div>
    <div class="bg-white rounded-xl shadow p-4">
        <p class="text-gray-500 text-sm">Total Família</p>
        <p id="saldoFamilia" data-value="{{ $totais['familia'] }}" class="text-2xl font-bold {{ $totais['familia'] >= 0 ? 'text-green-700' : 'text-red-700' }}">
            R$ {{ number_format($totais['familia'], 2, ',', '.') }}
        </p>
    </div>
    <div class="bg-white rounded-xl shadow p-4 border-2 border-red-800">
        <p class="text-gray-500 text-sm">Saldo Líquido Geral</p>
        <p id="saldoGeral" data-value="{{ $totais['saldo'] }}" class="text-2xl font-bold {{ $totais['saldo'] >= 0 ? 'text-green-700' : 'text-red-700' }}">
            R$ {{ number_format($totais['saldo'], 2, ',', '.') }}
        </p>
    </div>
</div>

<div class="flex gap-2 mb-3" id="filtros">
    <button data-filtro="Todos" class="btn-filtro bg-red-800 text-white px-3 py-1 rounded-full text-sm">Todos</button>
    <button data-filtro="Açougue" class="btn-filtro bg-white border px-3 py-1 rounded-full text-sm">Açougue</button>
    <button data-filtro="Família" class="btn-filtro bg-white border px-3 py-1 rounded-full text-sm">Família</button>
</div>

<div class="bg-white rounded-xl shadow divide-y" id="listaTransacoes">
    @foreach ($transacoes as $t)
        <div class="flex justify-between items-center p-3 gap-3" data-tag="{{ $t['tag'] }}" data-tipo="{{ $t['tipo'] }}">
            <div>
                <span class="text-xs px-2 py-0.5 rounded-full {{ $t['tag'] === 'Açougue' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700' }}">
                    [{{ $t['tag'] }}]
                </span>
                <span class="ml-2">{{ $t['desc'] }}</span>
                <span class="ml-2 text-xs text-gray-400">{{ \Carbon\Carbon::parse($t['data'])->format('d/m/Y') }}</span>
            </div>
            <span class="font-semibold {{ $t['tipo'] === 'receita' ? 'text-green-700' : 'text-red-700' }}">
                {{ $t['tipo'] === 'receita' ? '+' : '-' }} R$ {{ number_format($t['valor'], 2, ',', '.') }}
            </span>
        </div>
    @endforeach
</div>

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
                <select name="tag" required class="mt-1 w-full rounded-lg border border-gray-300 p-2.5">
                    <option value="Açougue">Açougue</option>
                    <option value="Família">Família</option>
                </select>
            </label>
            <label class="block text-sm font-medium text-gray-700">
                Descrição
                <input name="desc" type="text" maxlength="120" required placeholder="Ex.: Venda no balcão" class="mt-1 w-full rounded-lg border border-gray-300 p-2.5">
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
