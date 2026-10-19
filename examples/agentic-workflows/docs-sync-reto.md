---
on:
  schedule: weekly

permissions: read-all

engine: copilot

safe-outputs:
  create-pull-request:
    title-prefix: "[docs] "
    labels: [documentation, automated]
---

# Sincronizar la documentación con el código (reto opcional)

Compara los endpoints definidos en `app/src/server.js` con la tabla de `app/README.md` y con `docs/api.md` si existe.

## Qué hacer

- Si hay endpoints en el código que no están documentados, o documentación de endpoints que ya no existen, prepara un pull request que corrija **solo la documentación**.
- Si todo está sincronizado, no crees nada.

## Reglas

- No modifiques archivos dentro de `app/src/` ni `app/test/`.
- En la descripción del PR lista cada diferencia encontrada y el archivo donde la verificaste.
- El PR siempre lo revisa una persona. No intentes aprobarlo ni fusionarlo.
