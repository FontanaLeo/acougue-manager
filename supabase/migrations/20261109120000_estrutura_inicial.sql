-- Tabelas de estoque e financeiro, regras de acesso e funções de escrita.

create table public.categorias (
  id bigint generated always as identity primary key,
  nome text not null unique check (char_length(trim(nome)) > 0),
  cor text not null check (cor ~ '^#[0-9a-fA-F]{6}$')
);

create table public.produtos (
  id bigint generated always as identity primary key,
  nome text not null unique check (char_length(trim(nome)) > 0),
  kg numeric(10, 2) not null default 0 check (kg >= 0),
  preco_kg numeric(10, 2) not null check (preco_kg >= 0),
  fornecedor text not null,
  estoque_minimo numeric(10, 2) not null default 0 check (estoque_minimo >= 0)
);

create table public.transacoes (
  id bigint generated always as identity primary key,
  categoria_id bigint not null references public.categorias (id),
  tipo text not null check (tipo in ('despesa', 'receita')),
  descricao text not null check (char_length(descricao) between 1 and 120),
  valor numeric(10, 2) not null check (valor > 0),
  data date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  criado_em timestamptz not null default now()
);

create index transacoes_categoria_id_idx on public.transacoes (categoria_id);

-- A chave pública fica visível no navegador: só quem fez login lê os dados,
-- e toda escrita passa pelas funções abaixo.
alter table public.categorias enable row level security;
alter table public.produtos enable row level security;
alter table public.transacoes enable row level security;

create policy "Usuários logados leem categorias" on public.categorias
  for select to authenticated using (true);
create policy "Usuários logados leem produtos" on public.produtos
  for select to authenticated using (true);
create policy "Usuários logados leem transações" on public.transacoes
  for select to authenticated using (true);

revoke all on public.categorias, public.produtos, public.transacoes from anon, authenticated;
grant select on public.categorias, public.produtos, public.transacoes to authenticated;

create function public.movimentar_estoque(p_produto_id bigint, p_tipo text, p_quantidade numeric)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if p_tipo is null or p_tipo not in ('entrada', 'saida') then
    raise exception 'Tipo de movimentação inválido.' using errcode = '22023';
  end if;

  if p_quantidade is null or p_quantidade < 0.1 then
    raise exception 'A quantidade deve ser de no mínimo 0,1 kg.' using errcode = '22023';
  end if;

  -- Uma saída maior que o saldo zera o item, sem deixá-lo negativo.
  update public.produtos
  set kg = case
    when p_tipo = 'entrada' then kg + round(p_quantidade, 2)
    else greatest(0, kg - round(p_quantidade, 2))
  end
  where id = p_produto_id;

  if not found then
    raise exception 'Produto não encontrado.' using errcode = 'P0002';
  end if;
end;
$$;

create function public.adicionar_transacao(p_categoria_id bigint, p_tipo text, p_descricao text, p_valor numeric)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_descricao text := trim(coalesce(p_descricao, ''));
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if not exists (select 1 from public.categorias where id = p_categoria_id) then
    raise exception 'Categoria inválida.' using errcode = '22023';
  end if;

  if p_tipo is null or p_tipo not in ('despesa', 'receita') then
    raise exception 'Tipo de lançamento inválido.' using errcode = '22023';
  end if;

  if char_length(v_descricao) not between 1 and 120 then
    raise exception 'A descrição deve ter de 1 a 120 caracteres.' using errcode = '22023';
  end if;

  if p_valor is null or p_valor < 0.01 or p_valor > 99999999.99 then
    raise exception 'O valor deve estar entre R$ 0,01 e R$ 99.999.999,99.' using errcode = '22023';
  end if;

  insert into public.transacoes (categoria_id, tipo, descricao, valor)
  values (p_categoria_id, p_tipo, v_descricao, round(p_valor, 2));
end;
$$;

revoke all on function public.movimentar_estoque(bigint, text, numeric) from public, anon;
revoke all on function public.adicionar_transacao(bigint, text, text, numeric) from public, anon;
grant execute on function public.movimentar_estoque(bigint, text, numeric) to authenticated;
grant execute on function public.adicionar_transacao(bigint, text, text, numeric) to authenticated;
