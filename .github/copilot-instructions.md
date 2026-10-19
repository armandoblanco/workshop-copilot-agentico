# Instrucciones para GitHub Copilot: Contoso Eventos

Este repositorio es el terreno de práctica de un workshop. La app vive en `app/`.

## Idioma

- Código de dominio, comentarios, mensajes de error y documentación en **español**.
- Términos técnicos estándar se quedan en inglés (`fetch`, `Content-Type`, `status`).

## Stack y comandos

- Node.js 22 o superior, módulos ES, **sin dependencias externas**.
- Servidor con `node:http`. Pruebas con `node:test`.
- Desde `app/`: `npm test` para probar, `npm start` para ejecutar.

## Reglas del proyecto

- Todo cambio de comportamiento lleva su prueba en `app/test/`.
- No agregues dependencias sin pedir aprobación explícita.
- Los errores de la API responden JSON con la forma `{ "error": "mensaje en español" }`.
- Valida siempre en el servidor, aunque el frontend ya valide.
- Nunca escribas secretos, tokens ni contraseñas en el código ni en los ejemplos.
- Mantén los cambios pequeños y enfocados en lo que pide el issue.

## Estructura

| Ruta | Contenido |
| ---- | --------- |
| `app/src/server.js` | Rutas y validaciones |
| `app/src/store.js` | Datos en memoria |
| `app/test/` | Pruebas |
| `app/public/index.html` | Frontend de una sola página |
| `docs/` | Guías del workshop |

## Antes de dar una tarea por terminada

1. Ejecuta `npm test` en `app/` y confirma que todo pasa.
2. Resume qué cambiaste y qué archivos tocaste.
3. Indica qué no pudiste verificar.
