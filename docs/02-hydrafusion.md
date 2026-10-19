# Módulo 2: HydraFusion, orquestación multi-modelo (research preview)

**Duración en vivo:** 15 minutos de práctica más 5 de discusión si hay tiempo.

## Objetivos

- Entender la diferencia entre elegir un modelo, Auto y HydraFusion
- Activar HydraFusion en la CLI, la app o VS Code
- Medir con un experimento propio en lugar de confiar en benchmarks del proveedor
- Decidir con criterio cuándo usarlo y cuándo no

## Conceptos clave

HydraFusion aparece en el selector de modelos, pero **no es un modelo**: es un orquestador que decide un flujo de trabajo para cada solicitud.

| Opción | Qué decide por ti |
| ------ | ----------------- |
| Modelo fijo | Nada. Tú eliges el modelo |
| Auto | Elige **el mejor modelo** para la solicitud |
| HydraFusion | Elige **el mejor flujo**, que puede usar uno o varios modelos para redactar, criticar, revisar o escalar, y te entrega un solo resultado |

**Estado y alcance** (verificado en documentación y changelog de GitHub):

- Es una **research preview**, sujeta a cambios. GitHub indica que no está pensada para cargas de producción.
- Disponible en Copilot CLI, VS Code y la Copilot app.
- Planes: Pro, Pro+, Business y Enterprise en VS Code y la app; en la CLI se anunció para todos los planes. En Business y Enterprise el admin debe habilitar las previews.
- **No hay cargo aparte.** El uso se cobra por los tokens de los modelos que HydraFusion invoque, a la tarifa de cada uno.
- Fuente secundaria (DEV Community, sin confirmar en docs oficiales): no está disponible en cloud agent, JetBrains, Visual Studio ni Copilot Chat en github.com.

## Lectura crítica de las cifras

GitHub reporta resultados contra Claude Opus 5 y GPT-5.6 Sol en TerminalBench 2.1, DeepSWE y **CheckpointBench**, un benchmark **interno** armado con sesiones reales de Copilot. Las notas de prensa citan reducciones de costo de entre 65 % y 67 % con calidad similar, según el benchmark.

Tómalas como una hipótesis, no como un hecho sobre tu código: son cifras del proveedor, medidas en su propio benchmark, en un producto que cambia semana a semana. **Por eso este módulo es un experimento.**

---

## Paso 2.1: Activarlo (3 min)

### En Copilot CLI

```bash
copilot update
copilot --experimental
```

Dentro de la sesión:

```
/model
```

Selecciona **HydraFusion (Research Preview)**. Alternativa: `/experimental on` y reiniciar.

Modo no interactivo (útil para repetir el experimento):

```bash
copilot --experimental --model hydrafusion -p "TU PROMPT"
```

### En la Copilot app

1. Abre **Settings**, busca "HydraFusion" y actívalo.
2. Selecciónalo en el selector de modelos de la sesión.

### En VS Code

1. Activa la configuración `chat.copilot.hydraFusion.enabled`.
2. Selecciona **HydraFusion** en el selector de modelos de Copilot Chat.

> Mientras trabaja, la CLI y la app muestran el progreso del flujo. No verás el texto de cada paso intermedio porque HydraFusion no es un único modelo.

---

## Paso 2.2: El experimento A/B/C (10 min)

La idea: la **misma tarea** con tres configuraciones, y medir.

| Config | Selector de modelo |
| ------ | ------------------ |
| A | Un modelo fijo que ya uses |
| B | Auto |
| C | HydraFusion |

### Tarea de prueba

Usa el **issue 02** (email inválido y duplicados), que tiene reglas claras y se verifica con pruebas.

**PROMPT (idéntico en las tres):**

```
Implementa lo que pide el issue "Bug: se aceptan emails inválidos y duplicados
en las inscripciones" en app/src/server.js, con sus pruebas en
app/test/api.test.js. Sigue las instrucciones del repositorio. Al terminar
ejecuta npm test y resume qué cambiaste.
```

> **Truco para el tiempo en vivo:** una sola corrida puede tardar varios minutos. Lanza las **tres como tres sesiones paralelas de la app** (Módulo 1, ejemplo 3), cada una desde su propia rama, y revisa los resultados al final del bloque o del día.

### Protocolo (para que la comparación sea justa)

1. Parte siempre del **mismo commit limpio**: `git switch -c experimento-X main`.
2. Una rama por configuración. No reutilices contexto de una corrida en otra (sesión nueva cada vez).
3. No intervengas durante la corrida. Si tienes que corregirle algo, anótalo como intervención.
4. Al terminar, anota los resultados en la tabla.

### Hoja de resultados

Copia esta tabla y complétala:

| Métrica | A: modelo fijo | B: Auto | C: HydraFusion |
| ------- | -------------- | ------- | -------------- |
| Tiempo hasta terminar (min) | | | |
| ¿`npm test` pasa a la primera? (sí/no) | | | |
| Pruebas nuevas agregadas | | | |
| ¿Cubre email duplicado en otro evento? (sí/no) | | | |
| Líneas del diff | | | |
| Intervenciones tuyas | | | |
| AI Credits consumidos | | | |
| Calidad del diff (1 a 5, a ciegas si puedes) | | | |

Para el consumo, consulta tu uso en la documentación **Monitoring your GitHub AI Credits usage**, o con `/usage` y `/chronicle cost-tips` dentro de la app.

### Cómo leer los resultados

- **Una corrida no es evidencia.** La variabilidad entre ejecuciones del mismo modelo puede ser mayor que la diferencia entre configuraciones. Si puedes, repite 3 veces cada una.
- Evalúa la **calidad del diff** sin mirar qué configuración lo produjo. Pídele a un compañero que ordene los tres.
- El ahorro real depende de tu mezcla de tareas. Una tarea simple casi siempre cuesta menos con un modelo ligero y no necesita orquestación.

> **Momento wow:** al final, comparar tres diffs lado a lado con datos propios convence más que cualquier slide de benchmark, en un sentido u otro.

---

## Paso 2.3: Discusión (5 min, opcional)

Preguntas para el grupo:

1. ¿Qué tareas de tu equipo justificarían flujos con crítica y revisión interna, y cuáles no?
2. ¿Cómo manejarías la falta de visibilidad de los pasos intermedios en un entorno regulado?
3. ¿Qué evalúa tu equipo hoy antes de cambiar el modelo por defecto?
4. ¿Qué datos necesitarías para aprobarlo con tu admin si es una preview?

> Una buena práctica sugerida por la comunidad: armar un pequeño conjunto de evaluación por lenguaje y framework antes de cambiar defaults del equipo.

---

## Troubleshooting

| Problema | Solución |
| -------- | -------- |
| No aparece HydraFusion | Actualiza (`copilot update`), activa modo experimental, o la configuración en la app o VS Code |
| Organización: no aparece | El admin debe permitir previews en la organización o empresa |
| Cada corrida da resultados muy distintos | Es esperable. Repite y compara medianas, no una sola corrida |
| Consumo más alto de lo esperado | Revisa tarifas por modelo y el uso en AI Credits. HydraFusion cobra los tokens de cada modelo que invoca |
| El panel de la CLI no muestra pasos | Por diseño no es un único modelo. Usa el resumen final y los logs de depuración si reportas feedback |

## Checklist del módulo

- [ ] HydraFusion activado en al menos una superficie
- [ ] Las tres corridas hechas sobre el mismo issue
- [ ] Hoja de resultados completa
- [ ] Una conclusión propia, con sus límites, para tu equipo
