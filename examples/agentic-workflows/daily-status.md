---
on:
  schedule: daily

permissions: read-all

engine: copilot

safe-outputs:
  create-issue:
    title-prefix: "[estado-diario] "
    labels: [report, daily-status]
    close-older-issues: true
---

# Reporte diario de Contoso Eventos

Crea un issue con el estado del repositorio en las últimas 24 horas.

## Contenido

1. **Issues**: cuántos se abrieron y cuántos se cerraron. Lista los 3 más antiguos que siguen abiertos.
2. **Pull requests**: cuáles están esperando revisión desde hace más de 2 días.
3. **Riesgos**: cualquier PR con checks fallidos.
4. **Siguiente paso sugerido**: una sola acción concreta para el equipo.

## Reglas

- Escribe en español, en Markdown, y que se lea en menos de un minuto.
- Usa solo datos que puedas consultar en el repositorio. Si no hay actividad, dilo en una línea en lugar de rellenar.
- No menciones a personas por nombre en la sección de riesgos.
