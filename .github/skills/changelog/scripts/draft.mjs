#!/usr/bin/env node
// Genera un borrador de changelog agrupando commits por tipo (convención feat/fix/docs/chore).
// Uso: node draft.mjs [--desde <ref>] [--max <n>]
import { execFileSync } from 'node:child_process';

const argumentos = process.argv.slice(2);
const valorDe = (nombre, porDefecto) => {
  const indice = argumentos.indexOf(nombre);
  return indice >= 0 && argumentos[indice + 1] ? argumentos[indice + 1] : porDefecto;
};

const desde = valorDe('--desde', null);
const maximo = valorDe('--max', '30');

const argumentosGit = ['log', '--no-merges', '--pretty=format:%h\t%s'];
if (desde) {
  argumentosGit.push(`${desde}..HEAD`);
} else {
  argumentosGit.push(`-n${maximo}`);
}

let salida;
try {
  salida = execFileSync('git', argumentosGit, { encoding: 'utf8' });
} catch (error) {
  console.error('No se pudo leer el historial de git:', error.message);
  process.exit(1);
}

const secciones = {
  feat: { titulo: 'Nuevo', lineas: [] },
  fix: { titulo: 'Corregido', lineas: [] },
  docs: { titulo: 'Documentación', lineas: [] },
  chore: { titulo: 'Mantenimiento', lineas: [] },
  otros: { titulo: 'Otros (revisar)', lineas: [] },
};

for (const linea of salida.split('\n').filter(Boolean)) {
  const [hash, ...resto] = linea.split('\t');
  const asunto = resto.join('\t');
  const coincidencia = asunto.match(/^(feat|fix|docs|chore)(\([^)]*\))?!?:\s*(.+)$/i);
  if (coincidencia) {
    const tipo = coincidencia[1].toLowerCase();
    secciones[tipo].lineas.push(`- ${coincidencia[3]} (${hash})`);
  } else {
    secciones.otros.lineas.push(`- ${asunto} (${hash})`);
  }
}

const hoy = new Date().toISOString().slice(0, 10);
console.log(`## Borrador de notas de versión (${hoy})\n`);
for (const seccion of Object.values(secciones)) {
  if (seccion.lineas.length === 0) continue;
  console.log(`### ${seccion.titulo}\n`);
  console.log(seccion.lineas.join('\n'));
  console.log('');
}
