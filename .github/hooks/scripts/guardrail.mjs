#!/usr/bin/env node
// Hook preToolUse: deniega comandos peligrosos antes de que Copilot los ejecute.
// Lee el payload JSON por stdin e imprime UN solo objeto JSON con la decisión.
//
// Notas de diseño:
// - Soporta los dos formatos de payload documentados: camelCase (toolName, toolArgs)
//   y PascalCase compatible con VS Code (tool_name, tool_input).
// - Escanea el texto completo de los argumentos, así no depende del esquema de cada herramienta.
// - Es una red de seguridad básica, NO un reemplazo del sandboxing (ver docs/05).

const reglas = [
  {
    id: 'rm-recursivo',
    patron: /\brm\s+-[a-zA-Z]*[rf][a-zA-Z]*\s+(\/|~|\$HOME)(\s|"|'|$)/,
    motivo: 'Borrado recursivo sobre la raíz o el home',
  },
  {
    id: 'push-forzado',
    patron: /\bgit\s+push\b[^"\n]*\s(--force|-f)\b/,
    motivo: 'git push forzado no permitido en este repositorio',
  },
  {
    id: 'drop-sql',
    patron: /\bDROP\s+(TABLE|DATABASE)\b/i,
    motivo: 'Sentencia SQL destructiva',
  },
  {
    id: 'curl-a-shell',
    patron: /\b(curl|wget)\b[^|"\n]*\|\s*(sudo\s+)?(sh|bash)\b/,
    motivo: 'Descargar y ejecutar un script remoto sin revisarlo',
  },
  {
    id: 'token-github',
    patron: /\b(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/,
    motivo: 'Parece un token de GitHub escrito en el comando',
  },
];

async function leerEntrada() {
  const partes = [];
  for await (const parte of process.stdin) partes.push(parte);
  const texto = Buffer.concat(partes).toString('utf8').trim();
  if (!texto) return {};
  try {
    return JSON.parse(texto);
  } catch {
    return {};
  }
}

const entrada = await leerEntrada();
const argumentosHerramienta = entrada.toolArgs ?? entrada.tool_input ?? '';
const texto =
  typeof argumentosHerramienta === 'string'
    ? argumentosHerramienta
    : JSON.stringify(argumentosHerramienta);

const infraccion = reglas.find((regla) => regla.patron.test(texto));

if (infraccion) {
  console.log(
    JSON.stringify({
      permissionDecision: 'deny',
      permissionDecisionReason: `Bloqueado por guardrails (${infraccion.id}): ${infraccion.motivo}`,
    }),
  );
} else {
  console.log(JSON.stringify({ permissionDecision: 'allow' }));
}
