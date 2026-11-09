import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

test('HTTP contract and exact-origin CORS', async (t) => {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}`;
  let res = await fetch(url + '/');
  assert.equal(res.status, 200);
  assert.match((await res.json()).message, /Hello World/);
  res = await fetch(url + '/api/v1/health');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).database, 'not-checked');
  res = await fetch(url + '/api/v1/health', { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  res = await fetch(url + '/api/v1/health', { headers: { Origin: 'https://untrusted.example' } });
  assert.equal(res.status, 403);
  assert.equal((await res.json()).error.code, 'CORS_FORBIDDEN');
  res = await fetch(url + '/missing');
  assert.equal(res.status, 404);
  assert.equal((await res.json()).error.code, 'NOT_FOUND');
  res = await fetch(url + '/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error.code, 'INVALID_JSON');
});
