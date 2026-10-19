# Feature: paginar GET /api/eventos

## Contexto

La lista de eventos devuelve todo. Con muchos eventos la respuesta crece sin control.

## Comportamiento esperado

- Parámetros opcionales: `?pagina=1&tamano=10` (por defecto pagina 1, tamano 10, máximo 50).
- La respuesta mantiene el arreglo de eventos y agrega los encabezados `X-Total` y `X-Pagina`.
- Valores inválidos (`pagina=0`, `tamano=abc`) responden 400 con mensaje en español.
- Sin parámetros, el comportamiento actual sigue funcionando para los 3 eventos de ejemplo.

## Criterios de aceptación

- [ ] Pruebas con y sin parámetros, y con valores inválidos.
- [ ] El frontend sigue cargando la lista.
- [ ] `npm test` pasa desde `app/`.
