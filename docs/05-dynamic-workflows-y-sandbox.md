# Módulo 5: Dynamic workflows y agentes con límites (sandboxing)

**Duración en vivo:** 20 minutos. Parte A (sandbox) 8 min, Parte B (dynamic workflows) 12 min.

## Objetivos

- Entender el sandboxing local y qué sí y qué no protege
- Crear y ejecutar un dynamic workflow con verificación y pausa humana
- Distinguir dynamic workflows, agentic workflows y HydraFusion
- Combinar ambos: orquestación autónoma **dentro de un límite**

## Tres cosas que se confunden

| | HydraFusion | Agentic workflows | Dynamic workflows |
| --- | --- | --- | --- |
| Qué es | Copilot decide el flujo de modelos **en cada solicitud** | Automatización del repo en **GitHub Actions**, escrita en Markdown | Orquestación **definida en código** dentro de una extensión de Copilot |
| Dónde corre | CLI, VS Code, app | Runners de Actions | CLI, app y SDK de Copilot |
| Quién decide el flujo | Copilot, en tiempo de ejecución | Tú, en el `.md` | Tú, en código, con pasos deterministas y agentes |
| Estado | Research preview | Public preview | Public preview |
| Módulo | 2 | 3 | 5 |

---

# Parte A: Sandboxing local

## Qué es

El sandboxing local ejecuta lo que Copilot lanza (comandos, herramientas, servidores MCP y de lenguaje locales) con **acceso restringido** a archivos, red y credenciales, usando controles nativos del sistema operativo. Pasó a disponibilidad general el 7 de octubre de 2026 en la CLI, la app y las sesiones de VS Code con Agent Host, **sin costo adicional**.

## Lo que hay que saber antes de confiar en él

- **Está apagado por defecto.** Hay que activarlo, o que la organización lo exija con una política.
- **La CLI y la app tienen configuraciones separadas.** Activarlo en una no lo activa en la otra.
- Es **contención de procesos, no una máquina virtual**.
- Según la documentación, las herramientas de archivos integradas de la CLI **aplican la política por sí mismas** y no están limitadas por el sandbox del sistema operativo.
- Requisitos de plataforma: macOS 15 o superior, Linux con las herramientas necesarias (bubblewrap) y Windows 11 reciente (la documentación pide builds y actualizaciones concretas de 25H2 o 26H1). Una versión anterior de la documentación decía "macOS y Linux" solamente: **confirma tu plataforma antes del taller**.
- Los valores por defecto de red y credenciales **difieren entre CLI y app** según fuentes secundarias. No los asumas: léelos en tu versión con `copilot help sandbox`.

## Paso 5.1: Activarlo (2 min)

```bash
# explica cómo funciona en tu sistema y qué prerrequisitos detecta
copilot help sandbox
copilot --sandbox             # inicia una sesión con sandbox
```

O dentro de una sesión: `/sandbox enable`. Para una sesión sin sandbox: `copilot --no-sandbox` (se rechaza si tu organización lo exige).

## Paso 5.2: Probar los límites (6 min)

Con el sandbox activo, pide cosas **inofensivas** que crucen el límite del proyecto. Anota qué se permitió y qué se bloqueó en **tu** configuración.

**PROMPTS (uno a la vez):**

```
Crea un archivo llamado prueba-sandbox.txt en mi carpeta de usuario (fuera de
este repositorio) con el texto "hola".
```

```
Crea un archivo prueba-sandbox.txt dentro de este repositorio, en la carpeta
app/, con el texto "hola".
```

```
Haz una petición HTTP a https://example.com y dime el código de respuesta.
```

```
Ejecuta git status y dime en qué rama estoy.
```

### Hoja de observaciones

| Prueba | ¿Permitido o bloqueado? | ¿Coincide con lo que esperabas? |
| ------ | ----------------------- | -------------------------------- |
| Escribir fuera del repo | | |
| Escribir dentro del repo | | |
| Petición de red | | |
| Comando git local | | |

> **Momento wow:** el valor está en **no depender de que el modelo se porte bien**. El límite lo impone el sistema operativo, no una instrucción.

Limpia al terminar: borra `prueba-sandbox.txt` de los dos lugares si se crearon.

### Endurecerlo

Las políticas se configuran con archivos de ajustes. **No copies claves de internet**: los nombres exactos salen de `copilot help sandbox` en tu versión. Lo que se puede restringir según la documentación:

- Qué directorios pueden leer o modificar los comandos
- Acceso a internet, red local y credenciales de Git y de `gh`
- Variables de entorno visibles

Para ejecución aislada total existe el sandbox **en la nube** (entorno Linux efímero hospedado por GitHub), que está en **public preview y se factura por uso**:

```bash
copilot --cloud --experimental
```

---

# Parte B: Dynamic workflows

## Qué son

Un dynamic workflow es una orquestación **definida en código** que puede ejecutar comandos y herramientas, dividir un objetivo en tareas paralelas, pasar resultados estructurados entre etapas, hacer que subagentes **verifiquen los hallazgos de otros** y pausarse para pedirte entrada. Se implementan como extensiones de Copilot.

- **Public preview.** En la app están siempre disponibles. En la CLI actívalos con `--experimental` o `/experimental on`.
- Por defecto, los workflows que Copilot crea **quedan en la sesión actual**. Para reutilizarlos y compartirlos se guardan como extensión y se distribuyen con un plugin.

## Paso 5.3: Explorar (2 min)

En una sesión de la CLI (con `--experimental`) o en la app:

```
What dynamic workflows are available?
```

```
Show me the guidance for writing dynamic workflows.
```

> Esas dos frases en inglés vienen de la documentación oficial. Así descubres qué hay y qué reglas de escritura aplican a **tu versión**, en lugar de depender de mi texto.

## Paso 5.4: Crear un workflow de preparación de release (6 min)

**PROMPT:**

```
Crea un dynamic workflow llamado "listo-para-release" para este repositorio. Debe:

1. Ejecutar las pruebas con npm test desde app/. Si fallan, detenerse e informar.
2. En paralelo, lanzar dos agentes de revisión: uno de seguridad y otro de
   cobertura de pruebas, ambos de solo lectura, que devuelvan hallazgos
   estructurados (severidad, archivo, descripción).
3. Un tercer agente que verifique cada hallazgo contra el código real y descarte
   los que no se sostengan.
4. Pausarse y pedirme aprobación antes de continuar si queda algún hallazgo de
   severidad alta.
5. Terminar con un reporte en Markdown: qué se verificó, qué se descartó y por
   qué, y qué queda pendiente.

Antes de escribirlo, muéstrame el diseño de las etapas y confirma cómo vas a
manejar los fallos de cada una.
```

**Qué evaluar del diseño que propone:**

| Pregunta | Qué buscas |
| -------- | ---------- |
| ¿Qué pasa si falla la etapa 1? | Se detiene, no sigue "por si acaso" |
| ¿Los agentes de revisión pueden editar? | No. Solo lectura |
| ¿El verificador ve solo la afirmación y el código, o también la conclusión del otro? | Mejor que verifique de forma independiente |
| ¿La pausa humana es obligatoria con hallazgos altos? | Sí |
| ¿Qué ocurre con los resultados nulos o a medias? | No se tratan como éxito |

## Paso 5.5: Ejecutarlo (3 min)

En lenguaje natural:

```
Ejecuta el workflow listo-para-release
```

O desde la terminal, una vez cargado:

```bash
copilot workflow run listo-para-release
```

Observa el avance por etapas y la pausa para tu aprobación.

> **Momento wow:** el paralelismo y la verificación cruzada son **parte de la estructura**, no un favor que le pides al modelo en cada prompt.

## Paso 5.6: Combinar con el sandbox (1 min, para llevarse)

Ejecuta el workflow de nuevo **con el sandbox activo** (`copilot --sandbox`). Es la combinación recomendada para dar más autonomía: **orquestación con pasos de verificación, dentro de un límite del sistema operativo**.

---

## Bonus: computer use (preview)

Copilot CLI y la app pueden operar aplicaciones de escritorio (public preview, macOS y Windows).

> **Úsalo solo con una aplicación inofensiva** (por ejemplo, una calculadora o un editor de notas vacío), sin sesiones iniciadas, sin datos personales en pantalla y nunca en una demo con credenciales visibles. Un agente que ve y controla tu pantalla es el caso de mayor riesgo de este workshop.

**PROMPT de demostración:**

```
Abre la aplicación Calculadora, calcula 1234 por 56 y dime el resultado que ves
en pantalla.
```

---

## Para llevar: autonomía y control

| Capa | Pregunta que responde | Dónde se ve |
| ---- | --------------------- | ----------- |
| Plan y aprobación | ¿Está bien lo que va a hacer? | Módulo 1 |
| Selección de modelos | ¿Con qué modelo y flujo? | Módulo 2 |
| Safe outputs | ¿Qué puede escribir? | Módulo 3 |
| Agentes de mínimo privilegio y hooks | ¿Qué herramientas tiene? | Módulo 4 |
| Sandbox | ¿Qué puede tocar aunque lo engañen? | Módulo 5 |

---

## Troubleshooting

| Problema | Solución |
| -------- | -------- |
| `copilot help sandbox` dice que falta algo | Instala el prerrequisito que indica (en Linux, las herramientas de bubblewrap) |
| Activé el sandbox en la CLI y la app no lo respeta | Son configuraciones separadas. Actívalo también en los ajustes de la app |
| Comandos fallan en Windows con sandbox | Verifica la versión de Windows 11 y las actualizaciones requeridas por la documentación |
| No hay dynamic workflows | Inicia la CLI con `--experimental`. En la app no requieren configuración |
| El workflow desaparece al cerrar la sesión | Es lo esperado por defecto: queda ligado a la sesión. Pídele que lo guarde como extensión reutilizable |
| `copilot workflow run` no encuentra el workflow | Confirma con "What dynamic workflows are available?" y que la extensión esté cargada |

## Checklist del módulo

- [ ] Sandbox activado y hoja de observaciones completa
- [ ] Un dynamic workflow creado con verificación cruzada y pausa humana
- [ ] Ejecutado con el sandbox activo
- [ ] Puedes explicar la diferencia entre HydraFusion, agentic workflows y dynamic workflows
