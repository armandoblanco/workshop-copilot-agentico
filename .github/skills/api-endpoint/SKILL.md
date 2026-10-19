---
name: api-endpoint
description: Agrega un endpoint nuevo a la API de Contoso Eventos siguiendo las convenciones del proyecto (ruta, validación, store, prueba, documentación). Úsalo cuando pidan un endpoint o una ruta nueva.
---

# Skill: api-endpoint

Checklist para agregar un endpoint sin romper las convenciones del proyecto.

## Pasos

1. **Ruta**: agrégala en `app/src/server.js` siguiendo el estilo existente (`partes[...]` y método HTTP).
2. **Validación**: crea una función `validarXxx(datos)` que devuelva `null` o un mensaje de error en español. Responde 400 con `{ "error": "..." }`.
3. **Datos**: si necesitas leer o escribir datos, agrega el método en `app/src/store.js`. No accedas a los arreglos desde el servidor.
4. **Pruebas** en `app/test/api.test.js` usando el helper `conServidor`:
   - caso feliz
   - validación fallida (400)
   - recurso inexistente (404), si aplica
5. **Documentación**: agrega el endpoint a la tabla de `app/README.md` y a `docs/api.md` si existe.
6. **Verificación**: ejecuta `npm test` desde `app/`.

## Reglas

- Sin dependencias nuevas.
- Mensajes de error y nombres de dominio en español.
- Códigos HTTP: 200 lectura, 201 creación, 400 entrada inválida, 404 no existe, 409 conflicto.
