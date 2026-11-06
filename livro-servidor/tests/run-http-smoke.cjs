const assert = require('node:assert/strict');
const path = require('node:path');
const { spawn } = require('node:child_process');

// The real app must use a disposable local CI database. No existing collection is dropped.
assert.ok(process.env.MONGODB_URI, 'Configure MONGODB_URI para a base isolada de CI.');
const database = new URL(process.env.MONGODB_URI);
assert.equal(database.protocol, 'mongodb:');
assert.ok(['127.0.0.1', '[::1]'].includes(database.hostname), 'MongoDB deve ser loopback.');
assert.equal(database.username + database.password, '', 'O CI não utiliza credenciais reais.');
assert.match(database.pathname, /^\/ci_[a-z0-9_]+$/i, 'A base deve ter prefixo ci_.');
const port = 3189;
const cwd = path.resolve(__dirname, '..');
const env = { ...process.env, PORT: String(port), NEXT_TEST_ORIGIN: 'http://127.0.0.1:' + port };
const server = spawn(process.execPath, ['bin/www'], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => { output = (output + chunk).slice(-24000); });
const runner = spawn(process.execPath, ['--test', 'tests/livros-http.test.cjs'], { cwd, env, stdio: 'inherit' });
const timeout = setTimeout(() => runner.kill('SIGTERM'), 90_000);
runner.once('error', error => { console.error(error.message); process.exitCode = 1; });
runner.once('exit', (code, signal) => {
  clearTimeout(timeout);
  server.kill('SIGTERM');
  if (code !== 0 || signal) { console.error(output); process.exitCode = 1; }
});
server.once('error', error => { console.error(error.message); runner.kill('SIGTERM'); process.exitCode = 1; });
