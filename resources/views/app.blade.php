<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Açougue Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @viteReactRefresh
    @vite(['resources/js/main.tsx'])
</head>
<body class="bg-gray-100 min-h-screen">
    <div id="root"></div>
</body>
</html>
