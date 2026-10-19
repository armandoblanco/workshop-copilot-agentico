# Docs: crear docs/api.md con la referencia de la API

## Contexto

La única documentación es la tabla del `app/README.md`. Falta detalle de entradas, salidas y errores.

## Qué se pide

Crear `docs/api.md` con, para cada endpoint: descripción, parámetros, cuerpo de ejemplo, respuestas posibles (códigos y JSON) y un ejemplo con `curl`.

## Criterios de aceptación

- [ ] Cubre todos los endpoints actuales de `app/src/server.js`.
- [ ] Los ejemplos de `curl` funcionan contra `npm start` en el puerto 3000.
- [ ] No describe comportamiento que el código no tenga.
- [ ] Enlazado desde `app/README.md`.
