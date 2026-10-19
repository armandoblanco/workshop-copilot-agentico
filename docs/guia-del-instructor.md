# Guía del instructor

Notas para quien da el workshop. Los participantes no necesitan leer esto.

## Agenda de 2 horas

| Hora | Bloque | Contenido | Superficie |
| ---- | ------ | --------- | ---------- |
| 0:00 - 0:10 | Apertura | Verificación de setup, panorama del día | Todas |
| 0:10 - 0:35 | Módulo 1 | Copilot app: ejemplos 1 a 4 | App |
| 0:35 - 0:50 | Módulo 2 | HydraFusion: activar y experimento | App o CLI |
| 0:50 - 0:55 | Descanso | Y preguntas rápidas | |
| 0:55 - 1:15 | Módulo 3 | Agentic workflows: pasos 3.1 a 3.5 | CLI y GitHub |
| 1:15 - 1:35 | Módulo 4 | Personalización: pasos 4.1 a 4.4 | CLI o app |
| 1:35 - 1:55 | Módulo 5 | Sandbox y dynamic workflows | CLI |
| 1:55 - 2:00 | Cierre | Lo que se llevan, siguiente paso | |

### Una advertencia honesta

Cinco módulos en dos horas son **cuatro minutos de margen**. Funciona si el setup está resuelto **antes** y si tratas la sesión como un recorrido guiado con práctica corta, no como cinco talleres completos. Si tu audiencia es nueva en Copilot, es más realista:

- **Opción A, recortar:** módulos 1, 3 y 4 (40 minutos cada uno), con 2 y 5 como demostración del instructor.
- **Opción B, dos sesiones de 2 horas:** sesión 1 con módulos 1 y 2 (más los ejemplos bonus de la app, que son los que más atención generan), sesión 2 con módulos 3, 4 y 5.

## Si vas tarde

| Situación | Qué recortar |
| --------- | ------------ |
| Setup tomó más de 15 minutos | Módulo 1: deja solo ejemplos 1 y 2. Pasa el 3 a demostración |
| Módulo 2 se alarga | El experimento A/B/C no cabe en vivo con runs reales. Ver truco abajo |
| Módulo 3: el workflow tarda | Muestra el `.lock.yml` y un resultado ya generado, y salta a la prueba de inyección con un issue previamente corrido |
| Módulo 4 | Deja 4.2 y 4.4. Las instrucciones (4.1) y la skill (4.3) pasan a tarea |
| Módulo 5 | Deja solo la Parte B. El sandbox se muestra como demostración de 3 minutos |

### Truco para el experimento de HydraFusion

Un solo run real puede tardar varios minutos. Lanza las **tres corridas en paralelo como tres sesiones de la app** (la técnica del Módulo 1, ejemplo 3) al inicio del Módulo 2, sigue con la explicación, y revisa los resultados al cierre del bloque o al final del día. Así aprovechas el paralelismo para enseñarlo y para medir.

## Preparación, 48 horas antes

- [ ] Prueba **todo** de punta a punta en una cuenta igual a la de los participantes. Los planes y las políticas de organización cambian lo que se ve.
- [ ] Confirma con el admin de cada organización participante: política de la app, Copilot CLI, **previews** (HydraFusion) y cloud agent (automations).
- [ ] Verifica tu versión de la app, de la CLI y de `gh aw`. Anota las versiones en tu guion.
- [ ] Ten una **rama `solucion`** con los issues 01 a 04 resueltos y con `issue-triage` compilado, para quien se quede atrás.
- [ ] Graba un video corto de respaldo de cada módulo. Si la red o el servicio fallan, sigues.
- [ ] Revisa la lista de "Datos no verificados" de más abajo y compruébalos tú.

## Riesgos y plan B

| Riesgo | Probabilidad | Plan B |
| ------ | ------------ | ------ |
| Previews no habilitadas en alguna organización | Alta | Cuenta personal con plan individual, o demostración desde tu máquina |
| HydraFusion no aparece | Media | Mostrar el selector desde tu cuenta; los participantes hacen A y B |
| Límite de uso o AI Credits agotados | Media | Pide a los participantes usar modelos ligeros en los ejercicios que no son del Módulo 2 |
| Agentes que tardan | Alta | Trabajo en paralelo (más sesiones) y resultados pregrabados |
| Sandbox no soportado en el equipo del participante | Media | Demostración tuya |
| Un agente hace algo inesperado | Baja | Trabajan en un repo propio de práctica, sin datos reales ni credenciales |

## Control de costo

- Cada participante usa **su propio repo de práctica**. Nada de repos de producción.
- Para tareas simples, un modelo ligero alcanza. Reserva los modelos grandes y HydraFusion para el Módulo 2.
- Las automations en la nube y el sandbox en la nube **se facturan por uso**: no las dejes corriendo después del workshop.
- Recuérdales desactivar las automations y los workflows programados al terminar (`daily-status` corre todos los días).

## Mensajes que conviene repetir

1. **Casi todo esto es preview.** Puede cambiar la semana que viene. Lo que enseñas son patrones, no pantallas.
2. **El agente propone, tú decides.** Plan, diff y pruebas son los puntos de control.
3. **Lo crítico va en un permiso, no en un prompt.** Instrucciones guían, hooks y sandbox garantizan.
4. **Mide con tus datos.** Los benchmarks son del proveedor.

## Datos no verificados (compruébalos antes de enseñarlos)

Durante la preparación de este material hubo afirmaciones que **no pude confirmar** en la documentación oficial. Cada una debe validarse en tu entorno:

| Dato | Dónde aparece | Qué hacer |
| ---- | ------------- | --------- |
| Nombre del campo de motivo de denegación en hooks (`permissionDecisionReason`) | Módulo 4 | Probar con la CLI y ver si el motivo se muestra |
| Si la app de escritorio ejecuta hooks | Módulo 4 | Probar la app. La referencia solo menciona CLI y cloud agent |
| Alias de herramientas en agentes (`read`, `search`) | Módulo 4 | Comparar con *Custom agents configuration* |
| Comando de inicialización de gh-aw y autenticación del motor | Módulo 3 | Usar `install.md` del repo gh-aw y la página del motor |
| Valores por defecto del sandbox por superficie, y Windows frente a solo macOS y Linux | Módulo 5 | `copilot help sandbox` y la página *About cloud and local sandboxes* |
| Disponibilidad de HydraFusion por plan (CLI "todos los planes", VS Code y app "Pro y superiores") y VS Code 1.140 como mínimo | Módulo 2 | Probar con una cuenta del plan del participante |
| Reducciones de costo de 65 % a 67 % | Módulo 2 | Son cifras de GitHub sobre benchmarks propios. No las presentes como hecho |
| Lista de slash commands de la app | Módulo 1 | Escribe `/` en tu versión |
| Precio y límites de AI Credits por plan | Todos | No cubierto en este material |

## Después del workshop

Preguntas de cierre para medir el aprendizaje:

1. ¿Qué piezas llevarías mañana a un proyecto real y cuáles esperarías a que salgan de preview?
2. ¿Qué safe output o permiso quitarías de lo que viste, por considerarlo demasiado amplio?
3. ¿Dónde pondrías un humano en el ciclo en tu proceso actual?

Pide a los participantes una foto de su hoja de resultados del Módulo 2: es el mejor material para tu siguiente edición.
