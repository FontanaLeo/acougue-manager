<?php

namespace App\Providers;

use App\Repositories\EstoqueRepository;
use App\Repositories\FinanceiroRepository;
use App\Repositories\Mock\MockEstoqueRepository;
use App\Repositories\Mock\MockFinanceiroRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    // De onde vêm os dados: para usar o Supabase, troque as classes Mock pelas novas aqui.
    public array $bindings = [
        EstoqueRepository::class => MockEstoqueRepository::class,
        FinanceiroRepository::class => MockFinanceiroRepository::class,
    ];
}
