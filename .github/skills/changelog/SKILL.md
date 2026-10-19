---
name: changelog
description: Genera un borrador de CHANGELOG agrupado por tipo (feat, fix, docs, chore) a partir del historial de git. Úsalo cuando pidan notas de versión o un changelog.
---

# Skill: changelog

Genera un borrador de notas de versión a partir de los mensajes de commit.

## Cuándo usarla

- Piden "notas de versión", "changelog" o "qué cambió desde la última versión".
- Antes de crear un release.

## Pasos

1. Identifica el rango. Si hay un tag previo, úsalo como punto de partida. Si no, usa los últimos 30 commits.
2. Ejecuta el script incluido:

   ```bash
   node .github/skills/changelog/scripts/draft.mjs --desde <tag-o-commit>
   ```

   Sin `--desde`, toma los últimos 30 commits.
3. Lee la salida y edítala:
   - Reescribe cada línea desde el punto de vista de quien usa la API.
   - Elimina commits de mantenimiento sin impacto visible.
   - Agrupa duplicados.
4. Entrega el resultado en Markdown con las secciones: Nuevo, Corregido, Documentación, Mantenimiento.

## Reglas

- No inventes cambios que no estén en el historial.
- Si un commit no sigue la convención (`feat:`, `fix:`, `docs:`, `chore:`), clasifícalo como "Otros" y márcalo para revisión.
