const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { setTimeout: delay } = require('node:timers/promises');

assert.ok(process.env.NEXT_TEST_ORIGIN, 'NEXT_TEST_ORIGIN é obrigatório.');
const origin = new URL(process.env.NEXT_TEST_ORIGIN);
assert.ok(['http:', 'https:'].includes(origin.protocol));
assert.ok(['127.0.0.1', '[::1]'].includes(origin.hostname), 'Somente servidor loopback.');
assert.equal(origin.username + origin.password + origin.search + origin.hash, '');
assert.equal(origin.pathname, '/');

test('Express + MongoDB real: inclui, lista, exclui e valida entradas em base isolada', { timeout: 60_000 }, async context => {
  const title = 'CI Livro ' + randomUUID();
  let createdId;
  let failure;
  async function request(url, options = {}, expected = 200) {
    const response = await fetch(new URL(url, origin), {
      ...options, redirect: 'error', signal: AbortSignal.any([context.signal, AbortSignal.timeout(5_000)]),
    });
    assert.equal(response.status, expected, (options.method || 'GET') + ' ' + url);
    assert.match(response.headers.get('content-type') || '', /application\/json/);
    return response.json();
  }
  try {
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      try { assert.ok(Array.isArray(await request('/livros'))); ready = true; break; }
      catch (error) { if (attempt === 39) throw error; await delay(250); }
    }
    assert.ok(ready);
    const initial = await request('/livros');
    const created = await request('/livros', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: title, codEditora: 123, resumo: 'Dados fictícios exclusivos do CI.', autores: ['Teste automatizado'] }),
    }, 201);
    assert.equal(created.ok, true);
    assert.match(created.livro._id, /^[a-f0-9]{24}$/i);
    createdId = created.livro._id;
    const after = await request('/livros');
    assert.ok(after.some(book => book._id === createdId && book.titulo === title));
    assert.equal(after.length, initial.length + 1);
    await request('/livros', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: '' }) }, 400);
    await request('/livros/id-invalido', { method: 'DELETE' }, 400);
    assert.equal((await request('/livros/' + createdId, { method: 'DELETE' })).ok, true);
    assert.ok(!(await request('/livros')).some(book => book._id === createdId));
    await request('/livros/' + createdId, { method: 'DELETE' }, 404);
    createdId = undefined;
  } catch (error) { failure = error; }
  finally {
    try {
      const leftovers = (await request('/livros')).filter(book => book.titulo === title);
      for (const book of leftovers) {
        assert.match(book._id, /^[a-f0-9]{24}$/i);
        await request('/livros/' + book._id, { method: 'DELETE' });
      }
    } catch (error) { failure = failure ? new AggregateError([failure, error], 'Smoke e limpeza falharam.') : error; }
  }
  if (failure) throw failure;
});
