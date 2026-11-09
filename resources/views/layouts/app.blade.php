<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Açougue Manager - @yield('titulo')</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen" data-page="@yield('page')">
    <nav class="bg-red-800 text-white shadow-md">
        <div class="max-w-6xl mx-auto px-4 flex justify-between items-center h-14">
            <span class="font-bold text-lg">🥩 Açougue Manager</span>
            <div class="space-x-4">
                <a href="{{ route('estoque.index') }}" class="hover:underline">Estoque</a>
                <a href="{{ route('financeiro.index') }}" class="hover:underline">Financeiro</a>
            </div>
        </div>
    </nav>
    <main class="max-w-6xl mx-auto p-4">
        @yield('conteudo')
    </main>
    @vite(['resources/js/app.ts'])
</body>
</html>
