# Contoso Eventos (app de práctica)

API pequeña de eventos e inscripciones, sin dependencias externas. Se usa como terreno de práctica en todos los módulos del workshop.

## Ejecutar

```bash
cd app
npm test      # 8 pruebas con node:test
npm start     # http://localhost:3000
```

Requiere Node.js 22 o superior.

## Endpoints actuales

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | `/health` | Estado del servicio |
| GET | `/api/eventos` | Lista de eventos |
| GET | `/api/eventos/:id` | Detalle de un evento |
| POST | `/api/eventos` | Crear un evento |
| GET | `/api/eventos/:id/inscripciones` | Inscripciones de un evento |
| POST | `/api/eventos/:id/inscripciones` | Inscribir a una persona |

## Brechas intencionales

La app funciona y sus pruebas pasan, pero le faltan cosas a propósito. Cada una es un issue listo para entregarle a un agente (ver `/issues`):

1. No se respeta la capacidad del evento (sobreventa).
2. Se aceptan emails inválidos y duplicados.
3. `GET /api/eventos` no tiene paginación.
4. No existe exportación de inscripciones a CSV.
5. No hay documentación de la API.
6. El frontend no muestra cupos disponibles ni estado vacío.
