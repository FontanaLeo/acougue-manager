// Confere se o Supabase está pronto para o app. Só faz consultas: não altera nada
// no projeto e nunca mostra a chave na tela.
import { existsSync, readFileSync } from 'node:fs';

const TABELAS = ['categorias', 'produtos', 'transacoes'];
const FUNCOES = ['movimentar_estoque', 'adicionar_transacao'];
const SQL_ESTRUTURA = 'Execute supabase/migrations/20261109120000_estrutura_inicial.sql no SQL Editor.';

let problemas = 0;

function ok(texto) {
  console.log(`[OK]    ${texto}`);
}

function problema(texto, solucao) {
  problemas += 1;
  console.log(`[FALTA] ${texto}\n        ${solucao}`);
}

function encerrar() {
  if (problemas) {
    console.log(`\nFaltam ${problemas} item(ns). Resolva e rode este comando de novo.`);
    process.exit(1);
  }
  console.log('\nSupabase pronto. Execute o seed.sql, se ainda não executou, e entre no sistema com o usuário criado.');
  process.exit(0);
}

function lerEnv() {
  const valores = {};
  const texto = readFileSync('.env', 'utf8').replace(/^﻿/, '');

  for (const linha of texto.split(/\r?\n/)) {
    const separador = linha.indexOf('=');
    if (separador < 1 || linha.trimStart().startsWith('#')) continue;
    valores[linha.slice(0, separador).trim()] = linha.slice(separador + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
  }

  return valores;
}

function conferirUrl(url) {
  if (!url) {
    problema('VITE_SUPABASE_URL está vazia.', 'Copie a URL do projeto em Connect ou Project Settings e cole no arquivo .env.');
    return false;
  }

  let endereco;
  try {
    endereco = new URL(url);
  } catch {
    problema('VITE_SUPABASE_URL não é um endereço válido.', 'Use o formato https://seu-projeto.supabase.co');
    return false;
  }

  if (endereco.hostname.endsWith('supabase.com') || endereco.pathname !== '/') {
    problema('VITE_SUPABASE_URL não é a URL do projeto.', 'Use só https://seu-projeto.supabase.co, sem /rest/v1 e sem o link do painel.');
    return false;
  }

  ok('URL do projeto preenchida.');
  return true;
}

function papelDoJwt(chave) {
  const partes = chave.split('.');
  if (partes.length !== 3) return null;

  try {
    return JSON.parse(Buffer.from(partes[1], 'base64url').toString()).role ?? null;
  } catch {
    return null;
  }
}

function conferirChave(chave) {
  if (!chave) {
    problema('VITE_SUPABASE_PUBLISHABLE_KEY está vazia.', 'Copie a chave publishable ou anon em Project Settings → API Keys.');
    return false;
  }

  const papel = papelDoJwt(chave);

  if (chave.startsWith('sb_secret_') || papel === 'service_role') {
    problema(
      'A chave no .env é secreta e não pode ficar no app.',
      'Troque pela chave publishable ou anon. Se ela já tiver sido compartilhada, gere uma nova no painel do Supabase.',
    );
    return false;
  }

  if (!chave.startsWith('sb_publishable_') && papel !== 'anon') {
    problema('A chave no .env não parece ser a publishable nem a anon.', 'Copie a chave novamente em Project Settings → API Keys.');
    return false;
  }

  ok('Chave pública preenchida, e não é a secreta.');
  return true;
}

async function chamar(url, chave, caminho, opcoes = {}) {
  const resposta = await fetch(`${url}${caminho}`, {
    ...opcoes,
    headers: { apikey: chave, 'content-type': 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  const corpo = await resposta.json().catch(() => ({}));

  return { status: resposta.status, corpo };
}

// Sem login o banco deve recusar com 42501: isso prova que o item existe e está protegido.
function conferirProtecao(nome, { status, corpo }, codigoAusente) {
  if (status === 404 || corpo.code === codigoAusente) {
    problema(`${nome} ainda não existe.`, SQL_ESTRUTURA);
  } else if (corpo.code === '42501') {
    ok(`${nome} existe e recusa quem não fez login.`);
  } else if (status < 300) {
    problema(`${nome} aceita acesso sem login.`, `Execute de novo as regras de acesso de ${SQL_ESTRUTURA.replace('Execute ', '')}`);
  } else {
    problema(`${nome} respondeu de forma inesperada (HTTP ${status}).`, 'Confira o projeto no painel do Supabase e tente de novo.');
  }
}

if (!existsSync('.env')) {
  problema('O arquivo .env não existe.', 'Execute: Copy-Item .env.example .env');
  encerrar();
}

const { VITE_SUPABASE_URL: urlInformada, VITE_SUPABASE_PUBLISHABLE_KEY: chave } = lerEnv();
const urlValida = conferirUrl(urlInformada);
const chaveValida = conferirChave(chave);
if (!urlValida || !chaveValida) encerrar();

const url = urlInformada.replace(/\/+$/, '');

try {
  const { status, corpo } = await chamar(url, chave, '/auth/v1/settings');

  if (status === 401 || status === 403) {
    problema('O Supabase recusou a chave.', 'Copie a chave publishable ou anon novamente, do mesmo projeto da URL.');
    encerrar();
  }

  if (status !== 200) {
    problema(`O Supabase respondeu com erro (HTTP ${status}).`, 'Confira se o projeto está ativo e não pausado no painel.');
    encerrar();
  }

  ok('Conexão com o projeto funcionando.');

  if (corpo.disable_signup === true) {
    ok('Cadastro aberto desativado.');
  } else {
    problema('Qualquer pessoa ainda pode criar conta.', 'Desative Allow new users to sign up em Authentication → Sign In / Providers.');
  }

  for (const tabela of TABELAS) {
    conferirProtecao(`Tabela ${tabela}`, await chamar(url, chave, `/rest/v1/${tabela}?select=id&limit=1`), 'PGRST205');
  }

  // Sem login estas chamadas são recusadas antes de executar a função.
  const argumentos = {
    movimentar_estoque: { p_produto_id: 0, p_tipo: 'entrada', p_quantidade: 0 },
    adicionar_transacao: { p_categoria_id: 0, p_tipo: 'receita', p_descricao: '', p_valor: 0 },
  };

  for (const funcao of FUNCOES) {
    const resposta = await chamar(url, chave, `/rest/v1/rpc/${funcao}`, {
      method: 'POST',
      body: JSON.stringify(argumentos[funcao]),
    });
    conferirProtecao(`Função ${funcao}`, resposta, 'PGRST202');
  }
} catch {
  problema('Não consegui falar com o Supabase nesse endereço.', 'Confira a URL no .env, sua internet e se o projeto não está pausado.');
}

encerrar();
