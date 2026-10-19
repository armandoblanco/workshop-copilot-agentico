import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearServidor } from '../src/server.js';

// Levanta un servidor nuevo por prueba para que cada una sea independiente.
async function conServidor(prueba) {
  const servidor = crearServidor();
  await new Promise((resolver) => servidor.listen(0, resolver));
  const base = `http://localhost:${servidor.address().port}`;
  try {
    await prueba(base);
  } finally {
    servidor.closeAllConnections?.();
    await new Promise((resolver) => servidor.close(resolver));
  }
}

const json = (cuerpo) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(cuerpo),
});

test('GET /health responde ok', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(`${base}/health`);
    assert.equal(respuesta.status, 200);
    assert.deepEqual(await respuesta.json(), { estado: 'ok' });
  });
});

test('GET /api/eventos devuelve los eventos de ejemplo', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(`${base}/api/eventos`);
    assert.equal(respuesta.status, 200);
    const eventos = await respuesta.json();
    assert.equal(eventos.length, 3);
  });
});

test('GET /api/eventos/:id devuelve 404 si no existe', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(`${base}/api/eventos/999`);
    assert.equal(respuesta.status, 404);
  });
});

test('POST /api/eventos crea un evento válido', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(
      `${base}/api/eventos`,
      json({ nombre: 'Demo Copilot', fecha: '2026-12-10', capacidad: 10, lugar: 'Weston' }),
    );
    assert.equal(respuesta.status, 201);
    const evento = await respuesta.json();
    assert.equal(evento.id, 4);
    assert.equal(evento.nombre, 'Demo Copilot');
  });
});

test('POST /api/eventos rechaza una capacidad inválida', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(
      `${base}/api/eventos`,
      json({ nombre: 'Sin cupo', fecha: '2026-12-10', capacidad: 0 }),
    );
    assert.equal(respuesta.status, 400);
  });
});

test('POST inscripción válida responde 201 y aparece en el listado', async () => {
  await conServidor(async (base) => {
    const creada = await fetch(
      `${base}/api/eventos/2/inscripciones`,
      json({ nombre: 'Sofía Díaz', email: 'sofia@contoso.com' }),
    );
    assert.equal(creada.status, 201);

    const listado = await fetch(`${base}/api/eventos/2/inscripciones`);
    const inscripciones = await listado.json();
    assert.ok(inscripciones.some((i) => i.email === 'sofia@contoso.com'));
  });
});

test('POST inscripción sin nombre responde 400', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(`${base}/api/eventos/2/inscripciones`, json({ email: 'x@contoso.com' }));
    assert.equal(respuesta.status, 400);
  });
});

test('POST inscripción a un evento inexistente responde 404', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(
      `${base}/api/eventos/999/inscripciones`,
      json({ nombre: 'Nadie', email: 'nadie@contoso.com' }),
    );
    assert.equal(respuesta.status, 404);
  });
});
