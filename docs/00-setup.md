# Módulo 0: Preparación (hacer ANTES del workshop)

**Duración en vivo:** 10 minutos de verificación. La instalación se hace antes.

> Casi todo en este workshop está en preview o cambió hace pocas semanas. Verifica el estado de tu cuenta con 24 horas de anticipación, no 5 minutos antes.

## Checklist de cuenta y permisos

| Requisito | Cómo verificarlo | Quién lo resuelve |
| --------- | ---------------- | ----------------- |
| Plan de Copilot activo (cualquier plan, o BYOK para la app) | github.com/settings/copilot | Tú |
| Copilot Business o Enterprise: política de la **Copilot app** habilitada | Settings de la organización | Admin de la organización |
| Copilot Business o Enterprise: **previews** habilitadas (necesarias para HydraFusion) | Políticas de Copilot de la organización | Admin |
| Copilot CLI habilitada en políticas (la app se apoya en ella) | Políticas de Copilot | Admin |
| Copilot cloud agent habilitado (solo para automations en la nube) | Políticas del repositorio | Admin |

## Software

```bash
node --version      # 22 o superior
git --version
gh --version        # GitHub CLI, autenticado con: gh auth login
```

Instala además:

1. **GitHub Copilot app**: descarga desde gh.io/app (macOS, Windows y Linux).
2. **GitHub Copilot CLI**:
   ```bash
   npm install -g @github/copilot@latest
   copilot --version
   ```
3. **gh-aw** (agentic workflows):
   ```bash
   gh extension install github/gh-aw
   gh aw --help
   ```
4. **VS Code** reciente, solo si vas a probar HydraFusion allí (requiere VS Code 1.140 o superior según la fuente secundaria consultada; verifica en tu versión).

## Preparar tu repositorio de práctica

1. Clona el repositorio público del workshop y crea con él un repositorio **propio** en GitHub (privado está bien). No trabajes directamente sobre el original: los agentes crearán ramas, PR e issues, y no tienes permisos de escritura sobre él.
   ```bash
   git clone https://github.com/armandoblanco/workshop-copilot-agentico.git mi-workshop-copilot
   cd mi-workshop-copilot
   rm -rf .git
   git init -b main
   git add .
   git commit -m "chore: workshop inicial"
   gh repo create mi-workshop-copilot --private --source=. --push
   ```
   Se parte de un historial limpio (`rm -rf .git`) a propósito: un fork tendría los issues desactivados y los scripts del workshop los necesitan.

   **Si tu repositorio va en GitHub Enterprise** (organización de empresa, GHE.com o GitHub Enterprise Server), autentícate contra ese host y crea el repo dentro de tu organización en lugar de tu cuenta personal:
   ```bash
   # Reemplaza HOST y ORG por los de tu empresa
   gh auth login --hostname HOST
   gh auth status --hostname HOST

   # El repo ya clonado y con git init (pasos anteriores)
   gh repo create HOST/ORG/mi-workshop-copilot \
     --private --source=. --push
   ```
   Para github.com con Enterprise Cloud, omite `HOST/` y usa `ORG/mi-workshop-copilot`. Si la organización usa SSO, autoriza tu token para la organización (`gh auth refresh`, o Settings > Applications en GitHub). Confirma con tu admin que puedes crear repositorios privados en la organización y que la visibilidad `--private` está permitida (si no, usa `--internal`).
   Verifica el remoto con `git remote -v`: debe apuntar a tu host y organización, no a `armandoblanco`.
2. Verifica que la app funciona:
   ```bash
   cd app
   npm test       # debe mostrar 8 pruebas pasando
   npm start      # http://localhost:3000
   ```
3. Crea los issues de práctica (puedes ver antes qué haría con `--dry-run`):
   ```bash
   bash scripts/seed-issues.sh --dry-run
   bash scripts/seed-issues.sh
   ```
4. Habilita **Actions** en el repositorio (necesario para el Módulo 3): en el repo, Settings > Actions > General > Actions permissions > *Allow all actions and reusable workflows* (o la opción que permita tu organización). En GitHub Enterprise, si la opción aparece bloqueada, la política la controla el admin de la organización o de la empresa.

## Verificación final (2 minutos)

| Prueba | Resultado esperado |
| ------ | ------------------ |
| Abrir la Copilot app e iniciar sesión | Ves tu inbox y tus repositorios |
| `copilot` en la terminal de la carpeta del repo | Abre una sesión sin errores de autenticación |
| `gh aw --help` | Muestra la ayuda de la extensión |
| `gh issue list` en el repo | Lista los 6 issues |

## Troubleshooting

| Problema | Qué revisar |
| -------- | ----------- |
| La app no abre sesión con tu cuenta de organización | Que el admin haya habilitado la política de la app y Copilot CLI |
| No ves HydraFusion en el selector de modelos | Que el admin permita previews, y la configuración de HydraFusion en la app o en VS Code (`chat.copilot.hydraFusion.enabled`) |
| `copilot` no existe tras instalar | Reabre la terminal; confirma que el directorio global de npm esté en tu PATH |
| `gh aw` no existe | `gh extension list`; reinstala la extensión |
| Los issues no se crean | `gh auth status` y que estés dentro del repo ya subido; en Enterprise, que la sesión sea contra tu host (`gh auth login --hostname HOST`) |
