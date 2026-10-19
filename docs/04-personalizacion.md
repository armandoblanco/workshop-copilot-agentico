# 🧩 Módulo 4: Personalización a escala, agentes, skills, hooks y MCP

**Duración en vivo:** 20 minutos. Este repositorio ya trae las piezas construidas: tu trabajo es **usarlas, romperlas y entender cuándo cada una**.

## 🎯 Objetivos

- ✅ Distinguir instrucciones, agentes, skills, hooks y MCP, y saber cuál usar para qué
- ✅ Invocar un agente personalizado y una skill con script incluido
- ✅ Probar un hook que bloquea comandos peligrosos
- ✅ Saber qué superficies soporta cada pieza

## 🧠 Las capas de personalización

| Pieza | Dónde vive | Para qué | Cómo se activa |
| ----- | ---------- | -------- | -------------- |
| **Instrucciones** | `.github/copilot-instructions.md` | Reglas que aplican **siempre** | Automático |
| **Agentes personalizados** | `.github/agents/NOMBRE.agent.md` | Un especialista con rol, herramientas y reglas propias | Se elige a mano (selector, `/agent`) o por contexto |
| **Skills** | `.github/skills/NOMBRE/SKILL.md` | Mini-runbook con scripts y recursos, cargado cuando la tarea lo amerita | Copilot lee la descripción y decide |
| **Hooks** | `.github/hooks/*.json` | Comandos **deterministas** en puntos del ciclo del agente | Automático en cada evento |
| **MCP** | `mcp.json`, ajustes del repo o `mcp-servers` en un agente | Conexión a sistemas externos | Herramientas disponibles para el agente |
| **Plugins** | Paquete instalable | Empaqueta agentes, skills, hooks y MCP para distribuirlos | Se instalan |

> 💡 **Regla práctica:** si debe cumplirse **siempre y sin excepción**, no lo pongas en una instrucción (el modelo puede ignorarla). Ponlo en un **hook** o en un permiso. Las instrucciones guían, los hooks garantizan.

### Superficies soportadas (según la documentación consultada)

| Pieza | Copilot CLI | Cloud agent | IDEs | App de escritorio |
| ----- | ----------- | ----------- | ---- | ----------------- |
| Agentes | ✓ | ✓ | Parcial | Verifica en tu versión |
| Skills | ✓ | ✓ | Parcial | La app respeta tu configuración existente |
| Hooks | ✓ | ✓ | No documentado | **No confirmado**. La referencia de hooks solo menciona CLI y cloud agent |
| MCP | ✓ | ✓ | ✓ | ✓ |

> ⚠️ La app está construida sobre la CLI, pero **no encontré confirmación oficial de que los hooks corran en ella**. Pruébalo antes del workshop y ajusta esta tabla con tu resultado.

---

## Paso 4.1: Instrucciones, comprobar que se aplican ⭐ (3 min)

Abre una sesión (CLI o app) y pregunta:

🤖 **PROMPT:**

```
Sin leer nada más, ¿qué reglas del proyecto estás siguiendo y de dónde las sacaste?
```

Compara con `.github/copilot-instructions.md`. Luego pídele que mejore las instrucciones a partir del repo:

```
/init
```

> 📝 **Observa:** `/init` genera o mejora las instrucciones del repositorio. Revisa cada línea que agregue: instrucciones infladas empeoran las respuestas y consumen contexto en cada turno.

---

## Paso 4.2: Un agente personalizado ⭐ (5 min)

Este repo trae tres agentes en `.github/agents/`:

| Agente | Rol | Detalle de diseño |
| ------ | --- | ----------------- |
| `test-writer` | Escribe pruebas con `node:test` | No toca `app/src/` |
| `security-reviewer` | Revisa seguridad | `tools: ["read", "search"]`: **solo lectura** |
| `release-engineer` | Prepara notas de versión | Usa la skill `changelog` |

📍 **Pasos**

1. En la CLI o la app, selecciona el agente con `/agent`.
2. Elige `security-reviewer` y pídele:

🤖 **PROMPT:**

```
Revisa app/src/server.js y dime qué riesgos de seguridad ves. Si no hay ninguno relevante, dilo y enumera qué revisaste.
```

3. Pídele ahora algo que **no debería poder hacer**:

```
Corrige tú mismo el primer problema que encontraste.
```

📝 **Observa:** al no tener herramientas de edición ni ejecución, debe negarse o proponer el cambio sin aplicarlo. Es **el principio de mínimo privilegio aplicado a un agente**.

> 📝 Los nombres de los alias de herramientas (`read`, `search`, `edit`, `execute`) vienen de la referencia de configuración de agentes. Si tu versión los nombra distinto, consulta *Custom agents configuration* en la documentación.

### Prueba cruzada

Selecciona `test-writer` y pide pruebas para el issue 01:

```
Escribe pruebas para el caso de capacidad llena del issue "se pueden inscribir más personas que la capacidad". Las pruebas deben fallar hoy porque el bug existe. No arregles el bug.
```

> 🌟 **Momento wow:** obtienes pruebas que **fallan por la razón correcta**. Es la mejor forma de verificar que un issue está bien entendido antes de implementarlo.

---

## Paso 4.3: Una skill con script incluido ⭐ (4 min)

La skill `changelog` tiene un `SKILL.md` y un script en `.github/skills/changelog/scripts/draft.mjs`. Copilot decide cuándo cargarla leyendo su **descripción**.

🤖 **PROMPT:**

```
Prepárame las notas de versión de lo que ha cambiado en este repositorio.
```

📝 **Observa:**

- ¿Cargó la skill sin que la nombraras? Si no, la **descripción** no es lo bastante clara: ajústala y vuelve a probar.
- ¿Ejecutó el script `draft.mjs`?
- ¿Reescribió las líneas desde el punto de vista del usuario, como pide el `SKILL.md`?

Ejecuta tú el script para ver su salida cruda:

```bash
node .github/skills/changelog/scripts/draft.mjs --max 20
```

> 💡 Las descripciones vagas hacen que Copilot no use la skill cuando debe. Cámbiala por una que diga **cuándo** usarla, no solo qué es.

Si la sesión ya estaba abierta y editaste una skill, recárgala con `/skills reload`.

---

## Paso 4.4: Un hook que protege ⭐ (5 min)

`.github/hooks/guardrails.json` registra un hook `preToolUse` que ejecuta `.github/hooks/scripts/guardrail.mjs` antes de cada herramienta. El script inspecciona los argumentos y **deniega** patrones peligrosos (borrado recursivo en la raíz, `git push --force`, `DROP TABLE`, `curl | bash`, tokens de GitHub).

### Probarlo sin Copilot (siempre funciona)

```bash
echo '{"toolName":"bash","toolArgs":"{\"command\":\"git push origin main --force\"}"}' | node .github/hooks/scripts/guardrail.mjs
echo '{"toolName":"bash","toolArgs":"{\"command\":\"npm test\"}"}' | node .github/hooks/scripts/guardrail.mjs
```

Esperado: la primera responde `"permissionDecision":"deny"`, la segunda `"allow"`.

### Probarlo con Copilot en la CLI

Usa un comando **inofensivo** que cumpla el patrón, no uno real:

🤖 **PROMPT:**

```
Ejecuta en la terminal este comando exactamente: echo "DROP TABLE usuarios"
```

📝 **Qué esperar:** la herramienta debería ser denegada por el hook. Si **no** lo es, tienes un dato importante: tu superficie no ejecuta hooks, o la ruta del script no se resuelve desde tu directorio de trabajo.

### Lo que debes decir en voz alta al grupo

- Este hook es una **red de seguridad básica**: son expresiones regulares, y las regex se pueden esquivar (por ejemplo, partiendo un comando en varios pasos).
- El control sólido es el **sandboxing** y los **permisos** (Módulo 5), no la lista de patrones.
- Según la documentación, si un hook de comando **falla o sale con código distinto de cero, la llamada se deniega**; un *timeout*, en cambio, **deja continuar** la llamada. Es decir: un hook lento puede convertirse en un hueco. Por eso `timeoutSec` es corto.
- El formato exacto del campo con el motivo de denegación (`permissionDecisionReason`) **no pude verificarlo en la documentación**. La decisión (`permissionDecision`) sí está documentada. Si el motivo no aparece en tu cliente, no afecta el bloqueo.

---

## Paso 4.5: MCP en un agente (demostración, 3 min)

Un agente puede declarar sus propios servidores MCP con `mcp-servers` en el frontmatter y restringir qué herramientas usa con `tools`:

```yaml
---
name: docs-lookup
description: Consulta documentación externa a través de un servidor MCP.
tools: ["read", "search", "mi-mcp/buscar"]
mcp-servers:
  mi-mcp:
    type: http
    url: https://TU-SERVIDOR-MCP.example.com/mcp
    tools: ["buscar"]
---
```

> ⚠️ Este bloque es una **plantilla**. La URL es ficticia: reemplázala por un servidor MCP real que tengas. Revisa la sintaxis exacta en *Custom agents configuration*, porque el esquema de `mcp-servers` cambia entre IDE y cloud agent.

Buenas prácticas para el grupo:

- Da a cada agente **solo** las herramientas MCP que necesita (`servidor/herramienta`).
- Los secretos de MCP no van en el archivo. Van en los secretos del repo o del entorno.
- Los MCP de terceros son **código que decide por tu agente**: revísalos como revisarías una dependencia.

---

## Paso 4.6: Empaquetar con un plugin (opcional)

Los plugins agrupan agentes, skills, hooks y MCP en un paquete instalable, para distribuirlos a un equipo u organización.

🤖 **PROMPT:**

```
Empaqueta los agentes, las skills y los hooks de este repositorio como un plugin de Copilot CLI. Antes de crear nada, consulta la documentación "Creating a plugin for GitHub Copilot CLI" y dime la estructura exacta que vas a generar.
```

> 📝 No incluyo aquí la estructura del plugin porque cambia entre versiones. Pedirle al agente que consulte primero la documentación evita copiar un formato obsoleto.

---

## 🛠️ Troubleshooting

| Problema | Solución |
| -------- | -------- |
| El agente no aparece en el selector | Archivo en `.github/agents/`, extensión `.agent.md`, frontmatter válido con `name` y `description`. En la CLI, descubre agentes en estructuras complejas de forma más fiable desde la versión 1.0.97 |
| La skill no se activa sola | Mejora la `description` y usa `/skills reload` |
| El hook no hace nada | Ejecuta la prueba manual con `echo ... | node`; verifica que corras Copilot **desde la raíz** del repo (la ruta del script es relativa) y que tu superficie soporte hooks |
| El agente de solo lectura igual edita | Revisa el alias de herramientas en tu versión y que el agente esté realmente seleccionado |
| Instrucciones ignoradas | Las instrucciones no son garantía. Pasa lo crítico a un hook o a un permiso |

## ✅ Checklist del módulo

- [ ] Confirmaste que las instrucciones se aplican
- [ ] Usaste `security-reviewer` y probaste su límite de solo lectura
- [ ] Obtuviste pruebas que fallan por la razón correcta con `test-writer`
- [ ] La skill `changelog` se activó (o mejoraste su descripción)
- [ ] El hook denegó un patrón de prueba, o descubriste que tu superficie no lo soporta
