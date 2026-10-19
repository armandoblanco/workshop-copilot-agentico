#!/usr/bin/env node
// Valida la consistencia del repositorio del workshop.
// Uso: node scripts/validate.mjs
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const errores = [];
const avisos = [];

const ruta = (...partes) => path.join(raiz, ...partes);
const leer = (relativa) => readFileSync(ruta(relativa), 'utf8');

function recorrer(directorio, filtro, acumulado = []) {
  for (const nombre of readdirSync(directorio)) {
    if (nombre === 'node_modules' || nombre === '.git') continue;
    const completa = path.join(directorio, nombre);
    if (statSync(completa).isDirectory()) recorrer(completa, filtro, acumulado);
    else if (filtro(completa)) acumulado.push(completa);
  }
  return acumulado;
}

// 1. Archivos obligatorios
const obligatorios = [
  'README.md', 'LICENSE', '.gitignore',
  'docs/00-setup.md', 'docs/01-copilot-app.md', 'docs/02-hydrafusion.md',
  'docs/03-agentic-workflows.md', 'docs/04-personalizacion.md',
  'docs/05-dynamic-workflows-y-sandbox.md', 'docs/guia-del-instructor.md', 'docs/referencias.md',
  'app/package.json', 'app/src/server.js', 'app/src/store.js', 'app/test/api.test.js', 'app/public/index.html',
  '.github/copilot-instructions.md', '.github/hooks/guardrails.json', '.github/hooks/scripts/guardrail.mjs',
  'scripts/seed-issues.sh',
];
for (const archivo of obligatorios) {
  if (!existsSync(ruta(archivo))) errores.push(`Falta el archivo: ${archivo}`);
}

// 2. JSON válido
for (const archivo of ['app/package.json', '.github/hooks/guardrails.json']) {
  try { JSON.parse(leer(archivo)); } catch (e) { errores.push(`JSON inválido en ${archivo}: ${e.message}`); }
}

// 3. Frontmatter de agentes y skills
function frontmatter(texto) {
  const coincidencia = texto.match(/^---\n([\s\S]*?)\n---/);
  if (!coincidencia) return null;
  const campos = {};
  for (const linea of coincidencia[1].split('\n')) {
    const par = linea.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (par) campos[par[1]] = par[2];
  }
  return campos;
}

for (const archivo of recorrer(ruta('.github/agents'), (f) => f.endsWith('.agent.md'))) {
  const relativa = path.relative(raiz, archivo);
  const campos = frontmatter(readFileSync(archivo, 'utf8'));
  const esperado = path.basename(archivo, '.agent.md');
  if (!campos) errores.push(`Sin frontmatter: ${relativa}`);
  else {
    if (campos.name !== esperado) errores.push(`${relativa}: name "${campos.name}" no coincide con "${esperado}"`);
    if (!campos.description) errores.push(`${relativa}: falta description`);
  }
}

for (const archivo of recorrer(ruta('.github/skills'), (f) => f.endsWith('SKILL.md'))) {
  const relativa = path.relative(raiz, archivo);
  const campos = frontmatter(readFileSync(archivo, 'utf8'));
  const esperado = path.basename(path.dirname(archivo));
  if (!campos) errores.push(`Sin frontmatter: ${relativa}`);
  else {
    if (campos.name !== esperado) errores.push(`${relativa}: name "${campos.name}" no coincide con la carpeta "${esperado}"`);
    if (!campos.description) errores.push(`${relativa}: falta description`);
  }
}

// 4. Workflows de ejemplo: frontmatter con on, permissions y safe-outputs
for (const archivo of recorrer(ruta('examples/agentic-workflows'), (f) => f.endsWith('.md'))) {
  const texto = readFileSync(archivo, 'utf8');
  const relativa = path.relative(raiz, archivo);
  const bloque = texto.match(/^---\n([\s\S]*?)\n---/);
  if (!bloque) { errores.push(`Sin frontmatter: ${relativa}`); continue; }
  for (const clave of ['on:', 'permissions:', 'safe-outputs:']) {
    if (!bloque[1].includes(clave)) errores.push(`${relativa}: falta ${clave}`);
  }
}

// 5. Enlaces relativos en Markdown
for (const archivo of recorrer(raiz, (f) => f.endsWith('.md'))) {
  const texto = readFileSync(archivo, 'utf8').replace(/```[\s\S]*?```/g, '');
  const enlaces = [...texto.matchAll(/\]\((?!https?:|mailto:|#)([^)\s]+)\)/g)];
  for (const [, destino] of enlaces) {
    const sinAncla = destino.split('#')[0];
    if (!sinAncla) continue;
    const resuelta = path.resolve(path.dirname(archivo), sinAncla);
    if (!existsSync(resuelta)) errores.push(`Enlace roto en ${path.relative(raiz, archivo)}: ${destino}`);
  }
}

// 6. Sintaxis de los scripts de Node
for (const archivo of recorrer(raiz, (f) => f.endsWith('.mjs') || f.endsWith('.js'))) {
  try {
    execFileSync(process.execPath, ['--check', archivo], { stdio: 'pipe' });
  } catch (e) {
    errores.push(`Error de sintaxis en ${path.relative(raiz, archivo)}: ${e.stderr?.toString().split('\n')[0]}`);
  }
}

// 7. Issues: primera línea con título
for (const archivo of recorrer(ruta('issues'), (f) => f.endsWith('.md'))) {
  if (!leer(path.relative(raiz, archivo)).startsWith('# ')) {
    errores.push(`El issue ${path.basename(archivo)} debe empezar con "# Título"`);
  }
}

// 8. Aviso de estilo: rayas largas
for (const archivo of recorrer(raiz, (f) => f.endsWith('.md'))) {
  if (readFileSync(archivo, 'utf8').includes('—')) {
    avisos.push(`Raya larga (—) en ${path.relative(raiz, archivo)}`);
  }
}

for (const aviso of avisos) console.warn(`AVISO: ${aviso}`);
if (errores.length > 0) {
  for (const error of errores) console.error(`ERROR: ${error}`);
  console.error(`\n${errores.length} error(es).`);
  process.exit(1);
}
console.log('Repositorio consistente.');
