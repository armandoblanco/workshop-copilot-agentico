# Módulo 1: GitHub Copilot app, dirigir agentes en paralelo

**Duración en vivo:** 25 minutos (ejemplos 1 a 4). Los ejemplos 5 a 10 son bonus para autoestudio o una segunda sesión.

## Objetivos

- Entender qué resuelve la app frente al editor y la terminal
- Arrancar sesiones desde issues reales, cada una en su propio worktree
- Dirigir varios agentes en paralelo y revisar sus cambios antes de integrarlos
- Usar plan, crítica y revisión de seguridad como controles de calidad
- Ver canvases, automations e historial de sesiones

## Conceptos clave

La Copilot app es una aplicación de escritorio construida sobre Copilot CLI. Su idea central es que **tú diriges y revisas, los agentes ejecutan en paralelo**.

| Concepto | Qué es |
| -------- | ------ |
| Sesión | Una conversación con un agente que trabaja en su propio espacio aislado (git worktree local, o sandbox en la nube) |
| Modo de sesión | **Interactive** (colaborativo), **Plan** (el agente planifica y tú apruebas) o **Autopilot** (autonomía total) |
| My work / inbox | Vista de issues y PRs de tus repositorios conectados, desde donde arrancas sesiones |
| Canvas | Superficie interactiva donde tú y el agente operan sobre el mismo artefacto (plan, PR, terminal, navegador, o una interfaz generada) |
| Automation | Tarea recurrente guardada que corre local o en la nube, por horario o a demanda |

> La app respeta tu configuración existente de Copilot (instrucciones, agentes, skills, MCP). Lo que configuraste en el Módulo 4 también funciona aquí.

## Antes de empezar

- La app instalada y con sesión iniciada (Módulo 0).
- Los 6 issues de práctica creados en tu repo.
- En la app, conecta el repositorio de práctica.

> Los nombres de botones y menús pueden cambiar entre versiones. Si algo no coincide, escribe `/` en el prompt de la app para ver los comandos disponibles en tu versión.

---

## Ejemplo 1: Recorrido y primera sesión (5 min)

**Pasos**

1. Abre la app. Observa la barra lateral: **Home**, **My work**, **Automations**, **Search** y la lista de **Sessions**.
2. En **My work** verás los issues del repo de práctica.
3. En la barra lateral, junto a **Sessions**, haz clic en **+** para iniciar una sesión.
4. Elige el repositorio y decide si la sesión corre en un **worktree nuevo** o en tu copia local. Para el workshop, usa worktree nuevo.
5. Elige el modo **Plan** y un modelo.

**PROMPT (modo Plan):**

```
Explícame la estructura de este repositorio: qué hace cada carpeta, cómo se
ejecutan las pruebas y qué brechas conocidas tiene la app. No modifiques nada.
```

**Observa:** el agente lee el repo, responde con contexto real y todavía no cambió ningún archivo.

> **Momento wow:** la sesión usa tu `.github/copilot-instructions.md` sin que se lo pidas. Pregúntale "¿qué reglas del proyecto estás siguiendo?" y compara con el archivo.

---

## Ejemplo 2: De un issue a un pull request con plan (8 min)

Trabajaremos el **issue 01** (sobreventa de cupos).

**Pasos**

1. En **My work**, abre el issue "Bug: se pueden inscribir más personas que la capacidad del evento".
2. Inicia una sesión desde el issue, en modo **Plan**.
3. Lee el plan que propone. Antes de aprobarlo, verifica que incluya: cambio en `server.js`, método nuevo en `store.js` si hace falta, y pruebas para 409 y para 201.
4. Si falta algo, pídelo con un mensaje de seguimiento:

**PROMPT de seguimiento:**

```
Ajusta el plan: agrega una prueba que llene el cupo del evento 1 y confirme el
409 en el intento siguiente. No cambies nada fuera de app/src y app/test.
```

5. Aprueba el plan y deja que ejecute.
6. Cuando termine, revisa el **diff** dentro de la sesión y ejecuta las pruebas en la terminal integrada:
   ```bash
   cd app && npm test
   ```
7. Abre el PR con el comando `/pr-open`.

**Verificar**

- Las pruebas nuevas existen y pasan.
- El diff solo toca `app/src` y `app/test`.
- El mensaje de error está en español y dice lo que pide el issue.

> **Momento wow:** el plan es el punto de control. Corregirlo cuesta una frase; corregir el código ya escrito cuesta más.

---

## Ejemplo 3: Tres agentes en paralelo (7 min)

Ahora lanza **tres sesiones a la vez**, una por issue:

| Sesión | Issue | Modo sugerido |
| ------ | ----- | ------------- |
| A | 02 Validar email y duplicados | Plan |
| B | 03 Paginación de eventos | Autopilot |
| C | 04 Exportar a CSV | Interactive |

**Pasos**

1. Crea tres sesiones con **+**, cada una desde su issue.
2. Mientras trabajan, alterna entre ellas desde la barra lateral. Cada una está en su propio worktree, así que no se pisan.
3. Cuando terminen, compara los diffs. **Observa dónde chocan**: las tres tocan `app/src/server.js`.
4. Integra en orden. Abre el primer PR con `/pr-open` y fusiónalo. Para los siguientes, actualiza la rama y resuelve el conflicto con ayuda del agente:

**PROMPT (en la sesión B, tras fusionar A):**

```
La rama principal cambió porque se fusionó el PR de validación de email.
Actualiza esta rama con main, resuelve los conflictos en app/src/server.js
conservando ambos comportamientos y vuelve a ejecutar npm test.
```

> **Momento wow:** el paralelismo no elimina la integración. La disciplina de revisar y fusionar en orden sigue siendo tuya.

> **Cuidado:** Autopilot es cómodo y es donde más hay que revisar el diff. Úsalo en tareas acotadas y con pruebas, como esta.

---

## Ejemplo 4: Críticos de calidad, rubber duck y revisión de seguridad (5 min)

Sobre el diff de cualquiera de las sesiones anteriores:

**Comandos y prompts**

```
/rubber-duck Critica mi enfoque: ¿qué casos borde no cubrí en esta implementación?
```

```
/spar Argumenta en contra de esta solución. ¿Qué haría fallar esto en producción?
```

```
/security-review
```

**Observa:**

- `/rubber-duck` pide la crítica a un **modelo distinto** del que usa la sesión.
- `/spar` ejecuta razonamiento adversarial para cuestionar tu enfoque.
- `/security-review` revisa los diffs actuales con foco en seguridad.

> **Tip crítico:** que un agente critique al otro reduce errores, pero no los elimina. Si todos los modelos comparten un sesgo, ninguno lo verá. La revisión humana sigue siendo obligatoria.

---

# Bonus (autoestudio o segunda sesión)

## Ejemplo 5: Canvas, interfaces generadas por el agente

Un canvas es una superficie compartida entre tú y el agente. Se crea con `/create-canvas` y una descripción.

**PROMPT 1, triage visual de issues:**

```
/create-canvas Quiero triar los issues abiertos de este repositorio de forma
rápida y visual. Muéstralos como tarjetas con su etiqueta y un resumen de una
línea, y permite marcar cuáles pasan a una sesión de agente.
```

**PROMPT 2, vista de sesiones y worktrees:**

```
/create-canvas Visualiza todas mis sesiones activas de la Copilot app y sus
worktrees asociados. Indica cuáles están activas y cuáles quedaron obsoletas, y
permite limpiar las obsoletas.
```

**PROMPT 3, canvas del dominio del workshop:**

```
/create-canvas Un tablero de cupos para Contoso Eventos: una barra por evento
con inscritos contra capacidad, leyendo de la API en http://localhost:3000.
Resalta en rojo los eventos llenos.
```

> **Momento wow:** el canvas no es una captura estática. Puedes pedirle cambios y el agente actúa sobre la misma superficie.

## Ejemplo 6: Automations, trabajo recurrente sin tocar nada

Las automations guardan una tarea y la ejecutan por horario o a demanda. Pueden ser **locales** o **en la nube** (la nube requiere Copilot cloud agent habilitado en el repo).

**Pasos**

1. Abre **Automations** en la barra lateral y revisa las **plantillas** incluidas antes de escribir una desde cero.
2. Para descubrir candidatas, usa el truco de auditar tus superficies de trabajo:

**PROMPT:**

```
Identifica dónde se me están quedando seguimientos pendientes o dónde repito
trabajo, y sugiere una lista corta de automations útiles para este repositorio.
```

3. Crea esta automation de ejemplo:

| Campo | Valor sugerido |
| ----- | -------------- |
| Nombre | Resumen diario de PRs |
| Frecuencia | Diaria, en horario laboral |
| Prompt | `Resume los pull requests abiertos de este repositorio: cuáles esperan revisión, cuáles tienen checks fallidos y cuál debería revisarse primero. Máximo 10 líneas, en español.` |

4. Ejecútala de inmediato con el botón de **play** de su tarjeta, sin esperar el horario.

> Con la opción de ejecutar en la nube, la automation corre en un sandbox hospedado por GitHub (en preview según la documentación) aunque tu computadora esté apagada.

## Ejemplo 7: Dividir y delegar con /fleet, /spawn y /fork

| Comando | Para qué |
| ------- | -------- |
| `/fleet [PROMPT]` | Lanza varios agentes en paralelo sobre una misma tarea |
| `/spawn [PROMPT]` | Crea una sesión hija enfocada para trabajo delegado |
| `/fork` | Bifurca la sesión actual para probar otro camino |
| `/merge-to-parent` | Trae el trabajo de la sesión bifurcada a la sesión padre |

**PROMPT:**

```
/fleet Revisa app/src/server.js desde tres ángulos en paralelo: validación de
entradas, manejo de errores y legibilidad. Devuélveme un hallazgo priorizado por
ángulo.
```

## Ejemplo 8: Memoria de trabajo con /chronicle

Como la app está construida sobre Copilot CLI, el historial de sesiones se puede consultar.

| Comando | Para qué |
| ------- | -------- |
| `/chronicle standup` | Resume tu trabajo del último día |
| `/chronicle search` | Busca en tu historial por tema |
| `/chronicle cost-tips` | Sugerencias para reducir tokens y costo |
| `/chronicle improve` | Sugiere mejoras a tus instrucciones |

**PROMPT:**

```
/chronicle improve
```

**Observa:** propone cambios a tu `copilot-instructions.md` a partir de cómo has trabajado. Revisa cada sugerencia antes de aceptarla: un historial pobre produce instrucciones pobres.

## Ejemplo 9: Ciclo de vida del PR sin salir de la app

| Comando | Para qué |
| ------- | -------- |
| `/pr-open` | Abre un PR con los cambios de la sesión |
| `/pr-fix-checks` | Corrige los checks fallidos de un PR abierto |
| `/pr-resolve-comments` | Resuelve los comentarios pendientes de revisión |
| `/pr-merge` | Fusiona el PR si es fusionable |

**Ejercicio:** rompe una prueba a propósito en un PR abierto, espera el fallo de CI y usa `/pr-fix-checks`. Luego deja un comentario de revisión y usa `/pr-resolve-comments`.

## Ejemplo 10: Frontend con vista previa integrada (issue 06)

1. En una terminal de la sesión: `cd app && npm start`.
2. Abre la app en el navegador integrado de la sesión.
3. Inicia una sesión desde el **issue 06** y pídele que verifique visualmente el resultado.

**PROMPT:**

```
Implementa lo que pide este issue. Cuando termines, levanta la app, ábrela en el
navegador integrado y confírmame con una captura que se ve el estado vacío y el
evento lleno. Si no puedes verificarlo visualmente, dilo.
```

## Extras rápidos

- **Bring your own key (BYOK):** puedes usar la app con tu propio proveedor de modelos si no tienes plan de Copilot.
- **Deep links:** la app abre desde terminal, tickets o herramientas internas con enlaces `ghapp://` (esquemas alternos documentados: `github-app://` y `gh://`). Consulta la documentación para el formato de cada ruta.
- **Skills integradas:** `/orchestrate` (coordinar trabajo entre sesiones o repos), `/research` (informe con citas), `/af` (buscar servidores MCP, skills y agentes instalables).

---

## Troubleshooting

| Problema | Solución |
| -------- | -------- |
| No aparece mi repositorio en la app | Conéctalo desde los ajustes y verifica permisos de tu cuenta |
| Dos cuentas de GitHub (licencia y repos) | La app permite cuentas separadas para la licencia de Copilot y para los repositorios (cambio de octubre de 2026) |
| La sesión no arranca en organización | Política de la app y Copilot CLI habilitadas por el admin |
| Los worktrees ocupan mucho disco | Elimina los de sesiones inactivas. VS Code también ofrece "Open worktree cleanup" |
| Un comando `/` no existe | La lista cambia entre versiones; escribe `/` para ver la tuya |

## Checklist del módulo

- [ ] Una sesión desde issue con plan aprobado y PR abierto
- [ ] Tres sesiones en paralelo y una integración con conflicto resuelto
- [ ] Un `/rubber-duck` y un `/security-review` ejecutados
- [ ] (Bonus) un canvas y una automation creados
