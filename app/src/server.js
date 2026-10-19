import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearStore } from './store.js';

const directorioPublico = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

function responderJson(res, estado, cuerpo) {
  res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(cuerpo));
}

async function leerCuerpoJson(req) {
  const partes = [];
  for await (const parte of req) partes.push(parte);
  const texto = Buffer.concat(partes).toString('utf8');
  if (!texto) return {};
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

function validarEvento(datos) {
  if (!datos || typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    return 'El nombre del evento es obligatorio';
  }
  if (typeof datos.fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
    return 'La fecha debe tener el formato AAAA-MM-DD';
  }
  if (!Number.isInteger(datos.capacidad) || datos.capacidad <= 0) {
    return 'La capacidad debe ser un entero mayor que cero';
  }
  return null;
}

function validarInscripcion(datos) {
  if (!datos || typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    return 'El nombre es obligatorio';
  }
  if (typeof datos.email !== 'string' || datos.email.trim() === '') {
    return 'El email es obligatorio';
  }
  return null;
}

export function crearServidor(store = crearStore()) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const partes = url.pathname.split('/').filter(Boolean);

    try {
      if (req.method === 'GET' && url.pathname === '/health') {
        return responderJson(res, 200, { estado: 'ok' });
      }

      if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
        const html = await readFile(path.join(directorioPublico, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      }

      // /api/eventos
      if (partes[0] === 'api' && partes[1] === 'eventos' && partes.length === 2) {
        if (req.method === 'GET') {
          return responderJson(res, 200, store.listarEventos());
        }
        if (req.method === 'POST') {
          const datos = await leerCuerpoJson(req);
          const error = datos === null ? 'El cuerpo debe ser JSON válido' : validarEvento(datos);
          if (error) return responderJson(res, 400, { error });
          const evento = store.crearEvento({
            nombre: datos.nombre.trim(),
            fecha: datos.fecha,
            capacidad: datos.capacidad,
            lugar: typeof datos.lugar === 'string' ? datos.lugar : '',
          });
          return responderJson(res, 201, evento);
        }
      }

      // /api/eventos/:id
      if (partes[0] === 'api' && partes[1] === 'eventos' && partes.length === 3 && req.method === 'GET') {
        const evento = store.obtenerEvento(Number(partes[2]));
        if (!evento) return responderJson(res, 404, { error: 'Evento no encontrado' });
        return responderJson(res, 200, evento);
      }

      // /api/eventos/:id/inscripciones
      if (partes[0] === 'api' && partes[1] === 'eventos' && partes[3] === 'inscripciones' && partes.length === 4) {
        const eventoId = Number(partes[2]);
        const evento = store.obtenerEvento(eventoId);
        if (!evento) return responderJson(res, 404, { error: 'Evento no encontrado' });

        if (req.method === 'GET') {
          return responderJson(res, 200, store.listarInscripciones(eventoId));
        }
        if (req.method === 'POST') {
          const datos = await leerCuerpoJson(req);
          const error = datos === null ? 'El cuerpo debe ser JSON válido' : validarInscripcion(datos);
          if (error) return responderJson(res, 400, { error });
          const inscripcion = store.crearInscripcion(eventoId, {
            nombre: datos.nombre.trim(),
            email: datos.email.trim(),
          });
          return responderJson(res, 201, inscripcion);
        }
      }

      return responderJson(res, 404, { error: 'Ruta no encontrada' });
    } catch (error) {
      console.error(error);
      return responderJson(res, 500, { error: 'Error interno del servidor' });
    }
  });
}

// Arranque directo: node src/server.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const puerto = Number(process.env.PORT ?? 3000);
  crearServidor().listen(puerto, () => {
    console.log(`Contoso Eventos escuchando en http://localhost:${puerto}`);
  });
}
