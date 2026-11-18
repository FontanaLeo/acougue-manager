-- Dados de exemplo. Pode rodar mais de uma vez sem duplicar.

insert into public.categorias (nome, cor) values
  ('Açougue', '#c2410c'),
  ('Família', '#1d4ed8')
on conflict (nome) do nothing;

insert into public.produtos (nome, kg, preco_kg, fornecedor, estoque_minimo) values
  ('Alcatra', 25.5, 42.90, 'Frigorífico Boi Forte', 10),
  ('Picanha', 8.2, 69.90, 'Frigorífico Boi Forte', 10),
  ('Patinho', 30.0, 32.50, 'Agropecuária Silva', 15),
  ('Linguiça', 18.0, 24.90, 'Casa de Carnes Central', 20),
  ('Costela', 12.4, 36.00, 'Frigorífico Boi Forte', 10)
on conflict (nome) do nothing;

update public.produtos p
set custo_kg = d.custo, custo_anterior_kg = d.anterior
from (
  values
    ('Alcatra', 31.50, 31.50),
    ('Picanha', 52.00, 50.00),
    ('Patinho', 26.00, 23.00),
    ('Linguiça', 16.00, 16.00),
    ('Costela', 24.00, 24.00)
) as d (nome, custo, anterior)
where p.nome = d.nome and p.custo_kg is null;

insert into public.lotes (produto_id, kg_inicial, kg_atual, origem)
select p.id, p.kg, p.kg, 'saldo_inicial'
from public.produtos p
where p.kg > 0 and not exists (select 1 from public.lotes l where l.produto_id = p.id);

update public.lotes l
set custo_kg = p.custo_kg, validade = current_date + d.dias
from public.produtos p
join (
  values ('Alcatra', 12), ('Picanha', 2), ('Patinho', 1), ('Linguiça', 3), ('Costela', 8)
) as d (nome, dias) on d.nome = p.nome
where l.produto_id = p.id and l.origem = 'saldo_inicial' and l.validade is null;

insert into public.clientes (nome)
select d.nome
from (values ('Dona Maria (exemplo)'), ('Seu João (exemplo)')) as d (nome)
where not exists (select 1 from public.clientes);

insert into public.fiado_lancamentos (cliente_id, tipo, descricao, valor)
select c.id, d.tipo, d.descricao, d.valor
from (
  values
    ('Dona Maria (exemplo)', 'compra', '2 kg de alcatra', 85.80),
    ('Dona Maria (exemplo)', 'pagamento', 'Pagamento em dinheiro', 40.00),
    ('Seu João (exemplo)', 'compra', '1 kg de picanha', 69.90)
) as d (cliente, tipo, descricao, valor)
join public.clientes c on c.nome = d.cliente
where not exists (select 1 from public.fiado_lancamentos);

insert into public.transacoes (categoria_id, tipo, descricao, valor, data)
select c.id, d.tipo, d.descricao, d.valor, d.data
from (
  values
    ('Açougue', 'despesa', 'Compra de Boi (Frigorífico)', 3200.00, date '2025-09-01'),
    ('Açougue', 'receita', 'Vendas no balcão', 5400.00, date '2025-09-05'),
    ('Família', 'despesa', 'Mercado', 680.00, date '2025-09-03'),
    ('Açougue', 'despesa', 'Conta de Luz do Açougue', 310.00, date '2025-09-04'),
    ('Família', 'despesa', 'Escola', 450.00, date '2025-09-05'),
    ('Família', 'receita', 'Salário extra', 1200.00, date '2025-09-02'),
    ('Açougue', 'despesa', 'Manutenção câmara fria', 250.00, date '2025-09-06')
) as d (categoria, tipo, descricao, valor, data)
join public.categorias c on c.nome = d.categoria
where not exists (select 1 from public.transacoes);
