-- Cadastro de produtos e categorias pela tela, para começar com o banco vazio.
-- Pode ser executado de novo: as funções são substituídas sem erro.

-- O produto começa sem estoque; o saldo entra pelas entradas, que criam os lotes.
create or replace function public.adicionar_produto(
  p_nome text,
  p_preco_kg numeric,
  p_fornecedor text,
  p_estoque_minimo numeric
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nome text := trim(coalesce(p_nome, ''));
  v_fornecedor text := trim(coalesce(p_fornecedor, ''));
  v_id bigint;
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if char_length(v_nome) not between 1 and 60 then
    raise exception 'O nome do produto deve ter de 1 a 60 caracteres.' using errcode = '22023';
  end if;

  if p_preco_kg is null or p_preco_kg < 0.01 or p_preco_kg > 99999.99 then
    raise exception 'O preço por kg deve estar entre R$ 0,01 e R$ 99.999,99.' using errcode = '22023';
  end if;

  if char_length(v_fornecedor) not between 1 and 80 then
    raise exception 'O fornecedor deve ter de 1 a 80 caracteres.' using errcode = '22023';
  end if;

  if p_estoque_minimo is null or p_estoque_minimo < 0 or p_estoque_minimo > 99999 then
    raise exception 'O estoque mínimo deve estar entre 0 e 99.999 kg.' using errcode = '22023';
  end if;

  insert into public.produtos (nome, kg, preco_kg, fornecedor, estoque_minimo)
  values (v_nome, 0, round(p_preco_kg, 2), v_fornecedor, round(p_estoque_minimo, 2))
  returning id into v_id;

  return v_id;
exception
  when unique_violation then
    raise exception 'Já existe um produto com esse nome.' using errcode = '22023';
end;
$$;

create or replace function public.adicionar_categoria(p_nome text, p_cor text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nome text := trim(coalesce(p_nome, ''));
begin
  if auth.uid() is null then
    raise exception 'Faça login para continuar.' using errcode = '42501';
  end if;

  if char_length(v_nome) not between 1 and 40 then
    raise exception 'O nome da categoria deve ter de 1 a 40 caracteres.' using errcode = '22023';
  end if;

  if p_cor is null or p_cor !~ '^#[0-9a-fA-F]{6}$' then
    raise exception 'Escolha uma cor para a categoria.' using errcode = '22023';
  end if;

  insert into public.categorias (nome, cor) values (v_nome, p_cor);
exception
  when unique_violation then
    raise exception 'Já existe uma categoria com esse nome.' using errcode = '22023';
end;
$$;

revoke all on function public.adicionar_produto(text, numeric, text, numeric) from public, anon;
revoke all on function public.adicionar_categoria(text, text) from public, anon;

grant execute on function public.adicionar_produto(text, numeric, text, numeric) to authenticated;
grant execute on function public.adicionar_categoria(text, text) to authenticated;
