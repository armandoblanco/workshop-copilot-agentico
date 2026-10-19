#!/usr/bin/env bash
# Crea en tu repositorio de GitHub los issues de práctica a partir de /issues.
# Requisitos: GitHub CLI (gh) autenticado y estar dentro del repositorio ya subido a GitHub.
# Uso: bash scripts/seed-issues.sh [--dry-run]
set -euo pipefail

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ "$DRY_RUN" == false ]]; then
  command -v gh >/dev/null 2>&1 || { echo "Falta GitHub CLI (gh). Instálalo desde https://cli.github.com"; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "Ejecuta primero: gh auth login"; exit 1; }
fi

for archivo in "$RAIZ"/issues/*.md; do
  titulo="$(head -n 1 "$archivo" | sed 's/^# //')"
  if [[ "$DRY_RUN" == true ]]; then
    echo "[dry-run] $(basename "$archivo") -> \"$titulo\""
  else
    echo "Creando: $titulo"
    gh issue create --title "$titulo" --body "$(tail -n +3 "$archivo")"
  fi
done

echo "Listo."
