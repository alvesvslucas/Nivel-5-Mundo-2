const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

// Unit checks run the actual CommonJS sources with model/router dependencies injected.
// They do not connect to MongoDB or start Express; the CI HTTP smoke does that separately.
function load(relative, dependencies, globals = {}) {
  const filename = path.join(root, relative);
  const module = { exports: {} };
  const context = { module, exports: module.exports, console: { log() {}, error() {} }, ...globals };
  context.require = name => {
    assert.ok(Object.hasOwn(dependencies, name), 'Dependency explicitly supplied: ' + name);
    return dependencies[name];
  };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  return module.exports;
}
function routes(dao) {
  const handlers = new Map();
  const router = {};
  for (const method of ['get', 'post', 'delete']) router[method] = (url, handler) => handlers.set(method + ' ' + url, handler);
  load('routes/livros.js', { express: { Router: () => router }, '../modelo/livro-dao': dao });
  return async (method, url, body, params = {}) => {
    const res = {
      statusCode: 200, body: undefined,
      status(code) { this.statusCode = code; return this; },
      json(value) { this.body = JSON.parse(JSON.stringify(value)); return this; },
    };
    await handlers.get(method + ' ' + url)({ body, params }, res);
    return res;
  };
}
const valid = () => ({ titulo: '  Livro teste  ', resumo: '  Resumo  ', codEditora: 123, autores: ['  Autor  '], _id: 'injetado', admin: true });

test('DAO retorna os resultados reais de criação/lista/exclusão e propaga falhas', async () => {
  const record = { _id: 'a'.repeat(24), titulo: 'Livro' };
  const dao = load('modelo/livro-dao.js', { './livro-schema': {
    find: async () => [record], create: async () => record, deleteOne: async () => ({ deletedCount: 1 }),
  } });
  assert.equal((await dao.obterLivros())[0], record);
  assert.equal(await dao.incluir({}), record);
  assert.equal((await dao.excluir(record._id)).deletedCount, 1);
  const error = new Error('falha simulada do model');
  const broken = load('modelo/livro-dao.js', { './livro-schema': {
    find: async () => { throw error; }, create: async () => { throw error; }, deleteOne: async () => { throw error; },
  } });
  for (const result of [broken.obterLivros(), broken.incluir({}), broken.excluir(record._id)]) await assert.rejects(result, error);
});

test('conexão aceita MONGODB_URI de teste e preserva fallback local sem credenciais', async () => {
  for (const [environment, expected] of [
    [{}, 'mongodb://127.0.0.1:27017/livraria'],
    [{ MONGODB_URI: 'mongodb://127.0.0.1:27017/ci_livraria' }, 'mongodb://127.0.0.1:27017/ci_livraria'],
  ]) {
    let actual;
    const mongoose = { connect(uri) { actual = uri; return Promise.resolve(); } };
    load('modelo/conexao.js', { mongoose }, { process: { env: environment }, global: { Promise } });
    await Promise.resolve();
    assert.equal(actual, expected);
  }
});

test('POST devolve JSON com ok e livro, normaliza dados e descarta campos extras', async () => {
  let received;
  const request = routes({ incluir: async value => { received = value; return { _id: 'a'.repeat(24), ...value }; } });
  const response = await request('post', '/', valid());
  assert.equal(response.statusCode, 201);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.livro._id, 'a'.repeat(24));
  assert.deepEqual(JSON.parse(JSON.stringify(received)), { titulo: 'Livro teste', resumo: 'Resumo', codEditora: 123, autores: ['Autor'] });
});

for (const [label, body] of [
  ['ausente', undefined], ['array', []], ['título vazio', { ...valid(), titulo: ' ' }],
  ['resumo inválido', { ...valid(), resumo: 7 }], ['editora inválida', { ...valid(), codEditora: 0 }],
  ['autores vazios', { ...valid(), autores: [] }], ['autor como objeto', { ...valid(), autores: [{}] }],
]) test('POST rejeita ' + label + ' antes de chamar o DAO', async () => {
  let writes = 0;
  const response = await routes({ incluir: async () => { writes++; } })('post', '/', body);
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.ok, false);
  assert.equal(writes, 0);
});

test('exclusão confirma resultado e diferencia ID inválido de livro ausente', async () => {
  const request = routes({ excluir: async () => ({ deletedCount: 1 }) });
  assert.equal((await request('delete', '/:id', undefined, { id: 'inválido' })).statusCode, 400);
  const removed = await request('delete', '/:id', undefined, { id: 'a'.repeat(24) });
  assert.equal(removed.statusCode, 200);
  assert.equal(removed.body.ok, true);
  const absent = await routes({ excluir: async () => ({ deletedCount: 0 }) })('delete', '/:id', undefined, { id: 'b'.repeat(24) });
  assert.equal(absent.statusCode, 404);
});

test('falhas do banco não viram sucesso e não expõem detalhes internos na resposta', async () => {
  const fail = async () => { throw new Error('detalhe interno que não deve aparecer'); };
  const request = routes({ obterLivros: fail, incluir: fail, excluir: fail });
  for (const response of [
    await request('get', '/'), await request('post', '/', valid()),
    await request('delete', '/:id', undefined, { id: 'a'.repeat(24) }),
  ]) {
    assert.equal(response.statusCode, 500);
    assert.equal(response.body.ok, false);
    assert.doesNotMatch(JSON.stringify(response.body), /detalhe interno/);
  }
});
