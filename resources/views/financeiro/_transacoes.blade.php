@forelse ($transacoes as $t)
    @php($receita = $t['tipo'] === 'receita')
    <div class="bg-white rounded-xl shadow p-4 border-l-4 {{ $receita ? 'border-green-600' : 'border-red-600' }}" data-categoria="{{ $t['categoria']['id'] }}">
        <div class="flex justify-between items-start gap-2">
            <h2 class="font-semibold text-lg">{{ $t['descricao'] }}</h2>
            <span class="text-xs px-2 py-1 rounded-full" style="color: {{ $t['categoria']['cor'] }}; background-color: {{ $t['categoria']['cor'] }}1a">{{ $t['categoria']['nome'] }}</span>
        </div>
        <p class="text-2xl font-bold mt-2 {{ $receita ? 'text-green-700' : 'text-red-700' }}">
            {{ $receita ? '+' : '-' }} R$ {{ number_format($t['valor'], 2, ',', '.') }}
        </p>
        <p class="text-gray-400 text-xs mt-1">{{ \Carbon\Carbon::parse($t['data'])->format('d/m/Y') }}</p>
    </div>
@empty
    <p class="col-span-full text-center text-gray-500 py-8">Nenhum lançamento cadastrado.</p>
@endforelse
