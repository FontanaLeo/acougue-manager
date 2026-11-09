@foreach ($resumo as $card)
    <div class="bg-white rounded-xl shadow p-4 {{ $card['destaque'] ? 'border-2 border-red-800' : '' }}">
        <p class="text-gray-500 text-sm">{{ $card['titulo'] }}</p>
        <p class="text-2xl font-bold {{ $card['valor'] >= 0 ? 'text-green-700' : 'text-red-700' }}">
            R$ {{ number_format($card['valor'], 2, ',', '.') }}
        </p>
    </div>
@endforeach
