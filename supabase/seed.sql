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
