# Bug: se aceptan emails inválidos y duplicados en las inscripciones

## Contexto

Hoy basta con que el email no esté vacío. `"hola"` se acepta como email, y la misma persona puede inscribirse varias veces al mismo evento.

## Comportamiento esperado

- Un email sin formato válido responde **400** con `{ "error": "El email no tiene un formato válido" }`.
- Un email ya inscrito en ese evento (sin distinguir mayúsculas) responde **409** con `{ "error": "Este email ya está inscrito en el evento" }`.
- El mismo email sí puede inscribirse en otro evento.

## Criterios de aceptación

- [ ] Pruebas para email inválido, duplicado en el mismo evento y mismo email en evento distinto.
- [ ] La validación vive en una función `validarInscripcion` del servidor.
- [ ] `npm test` pasa desde `app/`.
