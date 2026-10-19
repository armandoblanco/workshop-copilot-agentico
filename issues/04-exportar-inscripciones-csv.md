# Feature: exportar las inscripciones de un evento a CSV

## Contexto

El equipo de logística necesita la lista de asistentes en una hoja de cálculo.

## Comportamiento esperado

- `GET /api/eventos/:id/inscripciones.csv` devuelve `text/csv; charset=utf-8`.
- Primera fila de encabezados: `id,nombre,email`.
- Valores con comas, comillas o saltos de línea se escapan según CSV estándar.
- Evento inexistente responde 404 con JSON `{ "error": "Evento no encontrado" }`.

## Criterios de aceptación

- [ ] Prueba con un nombre que contenga una coma.
- [ ] Prueba del 404.
- [ ] Sin dependencias nuevas (la serialización es corta, no necesita librería).
- [ ] `npm test` pasa desde `app/`.
