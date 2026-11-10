-- Direitos dos clientes (correção e exclusão dos dados) e identificação do açougue.
-- Pode ser executado de novo: completa o que faltar e não repete o que já existe.

alter table public.clientes add column if not exists anonimizado_em timestamptz;

-- Linha única com quem responde pelos dados, mostrada no aviso e nos relatórios.
create table if not exists public.empresa (
  id boolean primary key default true check (id),
  nome text not null check (char_length(nome) between 1 and 120),
  contato text not null check (char_length(contato) between 1 and 120),
  atualizado_em timestamptz not null default now()
);

alter table public.empresa enable row level security;

drop policy if exists "Usuários logados leem a empresa" on public.empresa;
create policy "Usuários logados leem a empresa" on public.empresa
  for select to authenticated using (true);

revoke all on public.empresa from anon, authenticated;
grant select on public.empresa to authenticated;

create or replace function public.atualizar_cliente(p_cliente_id bigint, p_nome text, p_telefone text)
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

  update public.clientes
  set nome = v_nome, telefone = v_telefone
  where id = p_cliente_id and anonimizado_em is null;

  if not found then
    raise exception 'Cliente não encontrado.' using errcode = 'P0002';
  end if;
end;
$$;

-- Apaga o que identifica a pessoa e mantém os valores, sem nome, nas contas do açougue.
create or replace function public.anonimizar_cliente(p_cliente_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_saldo numeric;
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  perform 1 from public.clientes where id = p_cliente_id and anonimizado_em is null for update;

  if not found then
    raise exception 'Cliente não encontrado.' using errcode = 'P0002';
  end if;

  select coalesce(sum(case when tipo = 'compra' then valor else -valor end), 0)
  into v_saldo
  from public.fiado_lancamentos
  where cliente_id = p_cliente_id;

  if v_saldo > 0 then
    raise exception 'Este cliente ainda tem saldo em aberto. Registre o pagamento antes de excluir os dados.' using errcode = '22023';
  end if;

  update public.fiado_lancamentos set descricao = 'Dado excluído' where cliente_id = p_cliente_id;

  update public.clientes
  set nome = 'Cliente excluído', telefone = null, anonimizado_em = now()
  where id = p_cliente_id;
end;
$$;

create or replace function public.salvar_empresa(p_nome text, p_contato text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nome text := trim(coalesce(p_nome, ''));
  v_contato text := trim(coalesce(p_contato, ''));
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if char_length(v_nome) not between 1 and 120 then
    raise exception 'O nome do açougue deve ter de 1 a 120 caracteres.' using errcode = '22023';
  end if;

  if char_length(v_contato) not between 1 and 120 then
    raise exception 'O contato deve ter de 1 a 120 caracteres.' using errcode = '22023';
  end if;

  insert into public.empresa (id, nome, contato)
  values (true, v_nome, v_contato)
  on conflict (id) do update
  set nome = excluded.nome, contato = excluded.contato, atualizado_em = now();
end;
$$;

-- Igual à versão anterior, mas não aceita lançamento em cliente já excluído.
create or replace function public.registrar_fiado(p_cliente_id bigint, p_tipo text, p_descricao text, p_valor numeric)
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

  perform 1 from public.clientes where id = p_cliente_id and anonimizado_em is null for update;

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

revoke all on function public.atualizar_cliente(bigint, text, text) from public, anon;
revoke all on function public.anonimizar_cliente(bigint) from public, anon;
revoke all on function public.salvar_empresa(text, text) from public, anon;

grant execute on function public.atualizar_cliente(bigint, text, text) to authenticated;
grant execute on function public.anonimizar_cliente(bigint) to authenticated;
grant execute on function public.salvar_empresa(text, text) to authenticated;
