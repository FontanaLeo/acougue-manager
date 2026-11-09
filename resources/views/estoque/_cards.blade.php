@forelse ($itens as $item)
    @php($estoqueBaixo = $item['kg'] < $item['estoque_minimo'])
    <div class="bg-white rounded-xl shadow p-4 border-l-4 {{ $estoqueBaixo ? 'border-red-600' : 'border-green-600' }}">
        <div class="flex justify-between items-start">
            <h2 class="font-semibold text-lg">{{ $item['nome'] }}</h2>
            @if ($estoqueBaixo)
                <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Estoque baixo</span>
            @endif
        </div>
        <p class="text-3xl font-bold mt-2">{{ number_format($item['kg'], 1) }} <span class="text-sm font-normal">kg</span></p>
        <p class="text-gray-500 text-sm mt-1">R$ {{ number_format($item['preco_kg'], 2, ',', '.') }} / kg</p>
        <p class="text-gray-400 text-xs mt-1">Fornecedor: {{ $item['fornecedor'] }}</p>
    </div>
@empty
    <p class="col-span-full text-center text-gray-500 py-8">Nenhum produto cadastrado.</p>
@endforelse
