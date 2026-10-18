import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function flat(o: any, p = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else Object.assign(out, flat(v, key));
  }
  return out;
}

const have: Record<string, string> = {};
Object.assign(have, flat(JSON.parse(readFileSync('src/i18n/locales/en.json', 'utf8'))));

// Parse the two TS message bundles: track nesting inside `en: { ... }`.
for (const f of ['src/i18n/onboarding.messages.ts', 'src/i18n/Citizenconfirm.messages.ts']) {
  const lines = readFileSync(f, 'utf8').split(/\r?\n/);
  let inEn = false;
  const stack: string[] = [];
  for (const line of lines) {
    if (/^\s*en:\s*\{\s*$/.test(line)) { inEn = true; stack.length = 0; continue; }
    if (!inEn) continue;
    const kv = line.match(/^\s*(\w+):\s*['"`]/);
    const nested = line.match(/^\s*(\w+):\s*\{/);
    const closes = (line.match(/\}/g) || []).length;
    if (kv && closes === 0) have[[...stack, kv[1]].join('.')] = '1';
    else if (nested) stack.push(nested[1]);
    for (let i = 0; i < closes; i++) { if (stack.length) stack.pop(); else inEn = false; }
  }
}

const files: string[] = [];
(function walk(d: string) {
  for (const e of readdirSync(d)) {
    const f = join(d, e);
    if (statSync(f).isDirectory()) walk(f);
    else if (/\.(vue|ts)$/.test(e)) files.push(f);
  }
})('src');

const missing = new Set<string>();
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/\bt\(\s*'([^']+)'/g)) if (!(m[1] in have)) missing.add(m[1]);
}
const keys = [...missing].sort();
const byTop: Record<string, number> = {};
for (const k of keys) byTop[k.split('.')[0]] = (byTop[k.split('.')[0]] || 0) + 1;
console.log('truly missing:', keys.length);
console.log(JSON.stringify(byTop));
console.log(keys.join('\n'));
