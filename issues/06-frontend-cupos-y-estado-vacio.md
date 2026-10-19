# UI: mostrar cupos disponibles y un estado vacío en el frontend

## Contexto

La tarjeta de cada evento muestra la capacidad total pero no cuántos cupos quedan. Si no hay eventos, la página queda en blanco.

## Qué se pide

- En cada tarjeta, mostrar "Cupos disponibles: X de Y" usando `GET /api/eventos/:id/inscripciones`.
- Si no hay eventos, mostrar el mensaje "Todavía no hay eventos programados".
- Si un evento está lleno, deshabilitar el botón "Inscribirme" y mostrar "Evento lleno".
- Mantener el diseño actual (azul oscuro, blanco, gris claro) y que se vea bien en móvil.

## Criterios de aceptación

- [ ] Verificado en el navegador integrado de la app o con capturas.
- [ ] Sin librerías externas.
- [ ] `npm test` sigue pasando desde `app/`.
