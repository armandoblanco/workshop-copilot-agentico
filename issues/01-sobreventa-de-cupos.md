# Bug: se pueden inscribir más personas que la capacidad del evento

## Contexto

El evento "Meetup de IA Aplicada" tiene capacidad 3 y ya tiene 2 inscripciones. Hoy se pueden registrar 10 personas más y la API responde 201 siempre.

## Comportamiento esperado

- Si el evento ya alcanzó su capacidad, `POST /api/eventos/:id/inscripciones` responde **409** con `{ "error": "El evento no tiene cupos disponibles" }`.
- Mientras haya cupo, sigue respondiendo 201.

## Criterios de aceptación

- [ ] Prueba que inscribe hasta llenar el cupo y recibe 409 en el siguiente intento.
- [ ] Prueba que confirma que con cupo disponible responde 201.
- [ ] `npm test` pasa desde `app/`.
- [ ] No se agregan dependencias.
