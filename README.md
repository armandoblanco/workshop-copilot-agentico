# Workshop: GitHub Copilot Agéntico

## De la Copilot app a los dynamic workflows, en 2 horas

![Duración](https://img.shields.io/badge/Duración-2%20horas-red)
![Módulos](https://img.shields.io/badge/Módulos-5-blue)
![Node](https://img.shields.io/badge/Node.js-22%2B-green)
![Estado](https://img.shields.io/badge/Features-preview-orange)

---

## Tabla de contenidos

- [Introducción](#introducción)
- [Agenda](#agenda)
- [Módulos](#módulos)
- [Pre-requisitos](#pre-requisitos)
- [Inicio rápido](#inicio-rápido)
- [Estructura del repositorio](#estructura-del-repositorio)
- [La app de práctica](#la-app-de-práctica)
- [Avisos importantes](#avisos-importantes)

---

## Introducción

Este workshop recorre **cinco capacidades agénticas** de GitHub Copilot sobre una misma app pequeña, **Contoso Eventos**. En cada módulo practicas con pasos copiables, ves qué observar y sales con una conclusión propia.

El hilo conductor es esta pregunta: **¿cuánta autonomía le das a un agente y qué controles pones alrededor?**

Al terminar sabrás:

- Dirigir varios agentes en paralelo desde la Copilot app y revisar su trabajo antes de integrarlo
- Medir HydraFusion con un experimento propio, en vez de creer un benchmark ajeno
- Automatizar tareas del repositorio con Agentic Workflows y contener sus riesgos con *safe outputs*
- Personalizar Copilot con instrucciones, agentes, skills, hooks y MCP
- Crear dynamic workflows con verificación cruzada y ejecutarlos dentro de un sandbox

> La app es **intencionalmente simple**. El objetivo no es construir software robusto, es practicar cómo dirigir, controlar y evaluar agentes.

---

## Agenda

| Hora | Bloque | Contenido |
| ---- | ------ | --------- |
| 0:00 - 0:10 | Apertura | Verificación de setup y panorama |
| 0:10 - 0:35 | Módulo 1 | Copilot app: sesiones paralelas y ejemplos |
| 0:35 - 0:50 | Módulo 2 | HydraFusion: experimento A/B/C |
| 0:50 - 0:55 | Descanso | |
| 0:55 - 1:15 | Módulo 3 | Agentic Workflows |
| 1:15 - 1:35 | Módulo 4 | Agentes, skills, hooks y MCP |
| 1:35 - 1:55 | Módulo 5 | Sandbox y dynamic workflows |
| 1:55 - 2:00 | Cierre | Recap y siguientes pasos |

> Es una agenda ajustada: cinco módulos en dos horas dejan poco margen. La [guía del instructor](docs/guia-del-instructor.md) propone recortes y una versión en dos sesiones. Cada módulo marca con lo esencial y deja el resto como bonus.

---

## Módulos

| # | Módulo | Qué practicas | Estado del producto |
| - | ------ | ------------- | ------------------- |
| 0 | [Preparación](docs/00-setup.md) | Cuentas, software, repo, issues | |
| 1 | [Copilot app](docs/01-copilot-app.md) | Plan, sesiones paralelas, crítica, canvases, automations, `/fleet`, `/chronicle`, PRs | Disponible en todos los planes. Algunas funciones en preview |
| 2 | [HydraFusion](docs/02-hydrafusion.md) | Activación y experimento comparativo con hoja de resultados | Research preview |
| 3 | [Agentic Workflows](docs/03-agentic-workflows.md) | Triage de issues, safe outputs, prueba de prompt injection | Public preview |
| 4 | [Personalización](docs/04-personalizacion.md) | 3 agentes, 2 skills, 1 hook, plantilla MCP | Mezcla de GA y preview |
| 5 | [Dynamic workflows y sandbox](docs/05-dynamic-workflows-y-sandbox.md) | Límites del sandbox y un workflow con verificación | Sandbox local GA. Dynamic workflows en public preview |

Material de apoyo: [guía del instructor](docs/guia-del-instructor.md) y [referencias](docs/referencias.md).

---

## Pre-requisitos

| Requisito | Detalle |
| --------- | ------- |
| Cuenta de GitHub con Copilot | Cualquier plan. La app también funciona con tu propio proveedor de modelos (BYOK) |
| Organizaciones (Business o Enterprise) | El admin debe habilitar la política de la app, Copilot CLI y, para HydraFusion, las previews |
| Node.js | 22 o superior |
| Git y GitHub CLI (`gh`) | Autenticado con `gh auth login` |
| GitHub Copilot app | gh.io/app |
| Copilot CLI | `npm install -g @github/copilot@latest` |
| Extensión gh-aw | `gh extension install github/gh-aw` |

La instalación completa y la verificación están en el [Módulo 0](docs/00-setup.md). **Hazla antes del workshop.**

---

## Inicio rápido

```bash
# 1. Sube este contenido a un repositorio tuyo
git init && git add . && git commit -m "chore: workshop inicial"
gh repo create mi-workshop-copilot --private --source=. --push

# 2. Verifica la app de práctica
cd app && npm test && cd ..

# 3. Crea los issues que los agentes van a trabajar
bash scripts/seed-issues.sh --dry-run   # ver qué crearía
bash scripts/seed-issues.sh             # crearlos

# 4. (Opcional) valida que el repo del workshop esté consistente
node scripts/validate.mjs
```

---

## Estructura del repositorio

```
.
├── README.md
├── docs/                          Guías paso a paso por módulo
│   ├── 00-setup.md
│   ├── 01-copilot-app.md
│   ├── 02-hydrafusion.md
│   ├── 03-agentic-workflows.md
│   ├── 04-personalizacion.md
│   ├── 05-dynamic-workflows-y-sandbox.md
│   ├── guia-del-instructor.md
│   └── referencias.md
├── app/                           App de práctica (Node.js, sin dependencias)
│   ├── src/ (server.js, store.js)
│   ├── test/api.test.js
│   └── public/index.html
├── issues/                        6 issues listos para entregar a agentes
├── examples/
│   └── agentic-workflows/         Fuentes .md para el Módulo 3
├── scripts/
│   ├── seed-issues.sh             Crea los issues con gh
│   └── validate.mjs               Valida la consistencia del repo
└── .github/
    ├── copilot-instructions.md    Instrucciones del proyecto
    ├── agents/                    test-writer, security-reviewer, release-engineer
    ├── skills/                    changelog (con script), api-endpoint
    └── hooks/                     guardrails.json + guardrail.mjs
```

---

## La app de práctica

**Contoso Eventos** es una API de eventos e inscripciones con un frontend de una sola página. Sus 8 pruebas pasan, pero tiene **seis brechas intencionales**, cada una convertida en un issue:

| # | Issue | Tipo |
| - | ----- | ---- |
| 01 | Sobreventa de cupos | Bug |
| 02 | Validar email y duplicados | Bug |
| 03 | Paginación de eventos | Feature |
| 04 | Exportar inscripciones a CSV | Feature |
| 05 | Documentar la API | Docs |
| 06 | Cupos disponibles y estado vacío en el frontend | UI |

Detalles en [`app/README.md`](app/README.md).

---

## Avisos importantes

- **Casi todo es preview.** HydraFusion es una *research preview*, Agentic Workflows y los dynamic workflows están en *public preview*, y varias funciones de la app son recientes. Los nombres, menús y comandos pueden cambiar. Los patrones duran más que las pantallas.
- **Información verificada y no verificada.** Las afirmaciones se contrastaron con la documentación oficial de GitHub a fecha 19 de octubre de 2026. Lo que no pudo confirmarse está listado en la [guía del instructor](docs/guia-del-instructor.md#datos-no-verificados-compruébalos-antes-de-enseñarlos). Compruébalo antes de enseñarlo.
- **Costos.** Los agentes consumen AI Credits, y los sandboxes y automations en la nube se facturan por uso. Usa repos de práctica y apaga lo programado al terminar.
- **Seguridad.** Trabaja siempre con un repositorio de práctica, sin credenciales ni datos reales. Los hooks de este repo son una red de seguridad básica, no un control de seguridad completo.
