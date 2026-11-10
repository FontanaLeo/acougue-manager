-- Lotes e validade, saídas com motivo, preço e margem, desossa e fiado.

alter table public.produtos
  add column custo_kg numeric(10, 2) check (custo_kg >= 0),
  add column custo_anterior_kg numeric(10, 2) check (custo_anterior_kg >= 0),
  add column margem_minima numeric(5, 2) not null default 25 check (margem_minima >= 0 and margem_minima < 100);

-- O saldo de cada produto é sempre a soma do saldo dos seus lotes.
create table public.lotes (
  id bigint generated always as identity primary key,
  produto_id bigint not null references public.produtos (id),
  kg_inicial numeric(10, 2) not null check (kg_inicial > 0),
  kg_atual numeric(10, 2) not null check (kg_atual >= 0 and kg_atual <= kg_inicial),
  custo_kg numeric(10, 2) check (custo_kg >= 0),
  validade date,
  origem text not null default 'entrada' check (origem in ('saldo_inicial', 'entrada', 'desossa')),
  criado_em timestamptz not null default now()
);

create index lotes_produto_id_idx on public.lotes (produto_id);

insert into public.lotes (produto_id, kg_inicial, kg_atual, origem)
select id, kg, kg, 'saldo_inicial' from public.produtos where kg > 0;

create table public.saidas (
  id bigint generated always as identity primary key,
  produto_id bigint not null references public.produtos (id),
  kg numeric(10, 2) not null check (kg > 0),
  motivo text not null check (motivo in ('venda', 'vencimento', 'aparas', 'perda_peso')),
  custo_total numeric(12, 2) not null check (custo_total >= 0),
  data date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  criado_em timestamptz not null default now()
);

create index saidas_produto_id_idx on public.saidas (produto_id);
create index saidas_data_idx on public.saidas (data);

create table public.desossas (
  id bigint generated always as identity primary key,
  descricao text not null check (char_length(descricao) between 1 and 120),
  peso_kg numeric(10, 2) not null check (peso_kg > 0),
  valor_total numeric(10, 2) not null check (valor_total > 0),
  data date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  criado_em timestamptz not null default now()
);

create table public.desossa_itens (
  id bigint generated always as identity primary key,
  desossa_id bigint not null references public.desossas (id),
  produto_id bigint not null references public.produtos (id),
  kg numeric(10, 2) not null check (kg > 0),
  custo_kg numeric(10, 2) not null check (custo_kg >= 0),
  unique (desossa_id, produto_id)
);

create index desossa_itens_produto_id_idx on public.desossa_itens (produto_id);

create table public.clientes (
  id bigint generated always as identity primary key,
  nome text not null check (char_length(nome) between 1 and 80),
  telefone text check (telefone ~ '^[0-9]{10,13}$'),
  criado_em timestamptz not null default now()
);

create table public.fiado_lancamentos (
  id bigint generated always as identity primary key,
  cliente_id bigint not null references public.clientes (id),
  tipo text not null check (tipo in ('compra', 'pagamento')),
  descricao text not null check (char_length(descricao) between 1 and 120),
  valor numeric(10, 2) not null check (valor > 0),
  data date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  criado_em timestamptz not null default now()
);

create index fiado_lancamentos_cliente_id_idx on public.fiado_lancamentos (cliente_id);

-- Como nas outras tabelas: só quem fez login lê, e toda escrita passa pelas funções.
alter table public.lotes enable row level security;
alter table public.saidas enable row level security;
alter table public.desossas enable row level security;
alter table public.desossa_itens enable row level security;
alter table public.clientes enable row level security;
alter table public.fiado_lancamentos enable row level security;

create policy "Usuários logados leem lotes" on public.lotes
  for select to authenticated using (true);
create policy "Usuários logados leem saídas" on public.saidas
  for select to authenticated using (true);
create policy "Usuários logados leem desossas" on public.desossas
  for select to authenticated using (true);
create policy "Usuários logados leem itens de desossa" on public.desossa_itens
  for select to authenticated using (true);
create policy "Usuários logados leem clientes" on public.clientes
  for select to authenticated using (true);
create policy "Usuários logados leem o fiado" on public.fiado_lancamentos
  for select to authenticated using (true);

revoke all on public.lotes, public.saidas, public.desossas, public.desossa_itens, public.clientes, public.fiado_lancamentos
  from anon, authenticated;
grant select on public.lotes, public.saidas, public.desossas, public.desossa_itens, public.clientes, public.fiado_lancamentos
  to authenticated;

drop function public.movimentar_estoque(bigint, text, numeric);

create function public.registrar_entrada(p_produto_id bigint, p_quantidade numeric, p_custo_kg numeric, p_validade date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if p_quantidade is null or p_quantidade < 0.1 or p_quantidade > 99999 then
    raise exception 'A quantidade deve estar entre 0,1 e 99.999 kg.' using errcode = '22023';
  end if;

  if p_custo_kg is null or p_custo_kg < 0.01 or p_custo_kg > 99999.99 then
    raise exception 'O custo por kg deve estar entre R$ 0,01 e R$ 99.999,99.' using errcode = '22023';
  end if;

  if p_validade is null or p_validade < (now() at time zone 'America/Sao_Paulo')::date then
    raise exception 'Informe uma validade que ainda não tenha passado.' using errcode = '22023';
  end if;

  update public.produtos
  set kg = kg + round(p_quantidade, 2),
      custo_anterior_kg = custo_kg,
      custo_kg = round(p_custo_kg, 2)
  where id = p_produto_id;

  if not found then
    raise exception 'Produto não encontrado.' using errcode = 'P0002';
  end if;

  insert into public.lotes (produto_id, kg_inicial, kg_atual, custo_kg, validade)
  values (p_produto_id, round(p_quantidade, 2), round(p_quantidade, 2), round(p_custo_kg, 2), p_validade);
end;
$$;

create function public.registrar_saida(p_produto_id bigint, p_quantidade numeric, p_motivo text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_produto public.produtos;
  v_lote public.lotes;
  v_total numeric(10, 2);
  v_restante numeric(10, 2);
  v_baixa numeric(10, 2);
  v_custo numeric(12, 2) := 0;
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if p_motivo is null or p_motivo not in ('venda', 'vencimento', 'aparas', 'perda_peso') then
    raise exception 'Motivo de saída inválido.' using errcode = '22023';
  end if;

  if p_quantidade is null or p_quantidade < 0.1 or p_quantidade > 99999 then
    raise exception 'A quantidade deve estar entre 0,1 e 99.999 kg.' using errcode = '22023';
  end if;

  select * into v_produto from public.produtos where id = p_produto_id for update;

  if not found then
    raise exception 'Produto não encontrado.' using errcode = 'P0002';
  end if;

  if v_produto.kg = 0 then
    raise exception 'Este produto está sem estoque.' using errcode = '22023';
  end if;

  -- Uma saída maior que o saldo zera o item, sem deixá-lo negativo.
  v_total := least(round(p_quantidade, 2), v_produto.kg);
  v_restante := v_total;

  -- Sai primeiro o que vence antes; lote sem validade é o estoque mais antigo.
  for v_lote in
    select * from public.lotes
    where produto_id = p_produto_id and kg_atual > 0
    order by validade nulls first, id
    for update
  loop
    exit when v_restante <= 0;

    v_baixa := least(v_lote.kg_atual, v_restante);
    update public.lotes set kg_atual = kg_atual - v_baixa where id = v_lote.id;
    v_custo := v_custo + round(v_baixa * coalesce(v_lote.custo_kg, v_produto.custo_kg, 0), 2);
    v_restante := v_restante - v_baixa;
  end loop;

  update public.produtos set kg = kg - v_total where id = p_produto_id;

  insert into public.saidas (produto_id, kg, motivo, custo_total)
  values (p_produto_id, v_total, p_motivo, v_custo);
end;
$$;

create function public.atualizar_preco(p_produto_id bigint, p_preco_kg numeric, p_margem_minima numeric)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if p_preco_kg is null or p_preco_kg < 0.01 or p_preco_kg > 99999.99 then
    raise exception 'O preço por kg deve estar entre R$ 0,01 e R$ 99.999,99.' using errcode = '22023';
  end if;

  if p_margem_minima is null or p_margem_minima < 0 or p_margem_minima > 99 then
    raise exception 'A margem mínima deve estar entre 0%% e 99%%.' using errcode = '22023';
  end if;

  update public.produtos
  set preco_kg = round(p_preco_kg, 2), margem_minima = round(p_margem_minima, 2)
  where id = p_produto_id;

  if not found then
    raise exception 'Produto não encontrado.' using errcode = 'P0002';
  end if;
end;
$$;

-- O valor pago é dividido entre os cortes conforme o valor de venda de cada um,
-- então um corte nobre fica com um custo por kg maior que um corte simples.
create function public.registrar_desossa(
  p_descricao text,
  p_peso_kg numeric,
  p_valor_total numeric,
  p_validade date,
  p_itens jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_descricao text := trim(coalesce(p_descricao, ''));
  v_desossa_id bigint;
  v_cortes integer;
  v_kg_total numeric;
  v_valor_venda numeric;
  v_sem_preco boolean;
  v_item record;
  v_custo_kg numeric(10, 2);
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if char_length(v_descricao) not between 1 and 120 then
    raise exception 'A descrição deve ter de 1 a 120 caracteres.' using errcode = '22023';
  end if;

  if p_peso_kg is null or p_peso_kg < 0.1 or p_peso_kg > 99999 then
    raise exception 'O peso deve estar entre 0,1 e 99.999 kg.' using errcode = '22023';
  end if;

  if p_valor_total is null or p_valor_total < 0.01 or p_valor_total > 99999999.99 then
    raise exception 'O valor pago deve estar entre R$ 0,01 e R$ 99.999.999,99.' using errcode = '22023';
  end if;

  if p_validade is null or p_validade < (now() at time zone 'America/Sao_Paulo')::date then
    raise exception 'Informe uma validade que ainda não tenha passado.' using errcode = '22023';
  end if;

  if p_itens is null or jsonb_typeof(p_itens) <> 'array' or jsonb_array_length(p_itens) = 0 then
    raise exception 'Informe ao menos um corte.' using errcode = '22023';
  end if;

  if exists (
    select 1 from jsonb_to_recordset(p_itens) as i (produto_id bigint, kg numeric)
    where i.kg is null or i.kg < 0.1 or i.kg > 99999
  ) then
    raise exception 'O peso de cada corte deve estar entre 0,1 e 99.999 kg.' using errcode = '22023';
  end if;

  if (
    select count(*) <> count(distinct i.produto_id)
    from jsonb_to_recordset(p_itens) as i (produto_id bigint, kg numeric)
  ) then
    raise exception 'Cada corte só pode aparecer uma vez.' using errcode = '22023';
  end if;

  perform 1
  from public.produtos p
  where p.id in (select i.produto_id from jsonb_to_recordset(p_itens) as i (produto_id bigint, kg numeric))
  order by p.id
  for update;

  select count(*), sum(round(i.kg, 2)), sum(round(i.kg, 2) * p.preco_kg), bool_or(p.preco_kg <= 0)
  into v_cortes, v_kg_total, v_valor_venda, v_sem_preco
  from jsonb_to_recordset(p_itens) as i (produto_id bigint, kg numeric)
  join public.produtos p on p.id = i.produto_id;

  if v_cortes <> jsonb_array_length(p_itens) then
    raise exception 'Produto não encontrado.' using errcode = 'P0002';
  end if;

  if v_kg_total > round(p_peso_kg, 2) then
    raise exception 'Os cortes não podem pesar mais que a peça.' using errcode = '22023';
  end if;

  if v_sem_preco then
    raise exception 'Defina o preço de venda de todos os cortes antes da desossa.' using errcode = '22023';
  end if;

  insert into public.desossas (descricao, peso_kg, valor_total)
  values (v_descricao, round(p_peso_kg, 2), round(p_valor_total, 2))
  returning id into v_desossa_id;

  for v_item in
    select i.produto_id, round(i.kg, 2) as kg, p.preco_kg
    from jsonb_to_recordset(p_itens) as i (produto_id bigint, kg numeric)
    join public.produtos p on p.id = i.produto_id
  loop
    v_custo_kg := round(v_item.preco_kg * round(p_valor_total, 2) / v_valor_venda, 2);

    insert into public.desossa_itens (desossa_id, produto_id, kg, custo_kg)
    values (v_desossa_id, v_item.produto_id, v_item.kg, v_custo_kg);

    insert into public.lotes (produto_id, kg_inicial, kg_atual, custo_kg, validade, origem)
    values (v_item.produto_id, v_item.kg, v_item.kg, v_custo_kg, p_validade, 'desossa');

    update public.produtos
    set kg = kg + v_item.kg, custo_anterior_kg = custo_kg, custo_kg = v_custo_kg
    where id = v_item.produto_id;
  end loop;
end;
$$;

create function public.adicionar_cliente(p_nome text, p_telefone text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nome text := trim(coalesce(p_nome, ''));
  v_telefone text := nullif(regexp_replace(coalesce(p_telefone, ''), '[^0-9]', '', 'g'), '');
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if char_length(v_nome) not between 1 and 80 then
    raise exception 'O nome deve ter de 1 a 80 caracteres.' using errcode = '22023';
  end if;

  if v_telefone is not null and char_length(v_telefone) not between 10 and 13 then
    raise exception 'Informe o telefone com DDD.' using errcode = '22023';
  end if;

  insert into public.clientes (nome, telefone) values (v_nome, v_telefone);
end;
$$;

create function public.registrar_fiado(p_cliente_id bigint, p_tipo text, p_descricao text, p_valor numeric)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_descricao text := trim(coalesce(p_descricao, ''));
  v_saldo numeric;
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if p_tipo is null or p_tipo not in ('compra', 'pagamento') then
    raise exception 'Tipo de lançamento inválido.' using errcode = '22023';
  end if;

  if char_length(v_descricao) not between 1 and 120 then
    raise exception 'A descrição deve ter de 1 a 120 caracteres.' using errcode = '22023';
  end if;

  if p_valor is null or p_valor < 0.01 or p_valor > 99999999.99 then
    raise exception 'O valor deve estar entre R$ 0,01 e R$ 99.999.999,99.' using errcode = '22023';
  end if;

  perform 1 from public.clientes where id = p_cliente_id for update;

  if not found then
    raise exception 'Cliente não encontrado.' using errcode = 'P0002';
  end if;

  select coalesce(sum(case when tipo = 'compra' then valor else -valor end), 0)
  into v_saldo
  from public.fiado_lancamentos
  where cliente_id = p_cliente_id;

  if p_tipo = 'pagamento' and round(p_valor, 2) > v_saldo then
    raise exception 'O pagamento não pode ser maior que o valor devido.' using errcode = '22023';
  end if;

  insert into public.fiado_lancamentos (cliente_id, tipo, descricao, valor)
  values (p_cliente_id, p_tipo, v_descricao, round(p_valor, 2));
end;
$$;

revoke all on function public.registrar_entrada(bigint, numeric, numeric, date) from public, anon;
revoke all on function public.registrar_saida(bigint, numeric, text) from public, anon;
revoke all on function public.atualizar_preco(bigint, numeric, numeric) from public, anon;
revoke all on function public.registrar_desossa(text, numeric, numeric, date, jsonb) from public, anon;
revoke all on function public.adicionar_cliente(text, text) from public, anon;
revoke all on function public.registrar_fiado(bigint, text, text, numeric) from public, anon;

grant execute on function public.registrar_entrada(bigint, numeric, numeric, date) to authenticated;
grant execute on function public.registrar_saida(bigint, numeric, text) to authenticated;
grant execute on function public.atualizar_preco(bigint, numeric, numeric) to authenticated;
grant execute on function public.registrar_desossa(text, numeric, numeric, date, jsonb) to authenticated;
grant execute on function public.adicionar_cliente(text, text) to authenticated;
grant execute on function public.registrar_fiado(bigint, text, text, numeric) to authenticated;
