import fs from 'node:fs';
import path from 'node:path';

/**
 * Atualiza VITE_UI_VERSION nos .env (CalVer YYYY.MM.DD.N, N = 0–9).
 * Uso deliberado: release local ou pipeline — não roda no `vite`/`dev`.
 *
 *   npm run version:ui
 *   npm run version:ui -- 2026.07.31.3
 *   VITE_UI_VERSION=2026.07.31.3 npm run version:ui
 */
const ENV_FILES = ['.env.development', '.env.production'];
const VERSION_RE = /^(\d{4})\.(\d{2})\.(\d{2})\.(\d)$/;

function todayParts(now = new Date()) {
  return {
    yyyy: String(now.getFullYear()),
    mm: String(now.getMonth() + 1).padStart(2, '0'),
    dd: String(now.getDate()).padStart(2, '0'),
  };
}

function readCurrentVersion(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const match = fs.readFileSync(filePath, 'utf8').match(/^VITE_UI_VERSION=(.+)$/m);
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

function nextVersion(current) {
  const { yyyy, mm, dd } = todayParts();
  const today = `${yyyy}.${mm}.${dd}`;
  const parsed = current?.match(VERSION_RE);

  if (parsed && `${parsed[1]}.${parsed[2]}.${parsed[3]}` === today) {
    const rev = Math.min(9, Number(parsed[4]) + 1);
    return `${today}.${rev}`;
  }

  return `${today}.1`;
}

function resolveTargetVersion() {
  const fromArg = process.argv[2];
  const fromEnv = process.env.VITE_UI_VERSION;
  if (fromArg && VERSION_RE.test(fromArg)) return fromArg;
  if (fromEnv && VERSION_RE.test(fromEnv)) return fromEnv;

  const existing =
    readCurrentVersion(path.resolve('.env.production')) ||
    readCurrentVersion(path.resolve('.env.development'));
  return nextVersion(existing);
}

function upsertUiVersion(filePath, version) {
  const absolute = path.resolve(filePath);
  const line = `VITE_UI_VERSION=${version}`;

  if (!fs.existsSync(absolute)) {
    fs.writeFileSync(absolute, `${line}\n`, 'utf8');
    return;
  }

  const content = fs.readFileSync(absolute, 'utf8');
  const next = /^VITE_UI_VERSION=/m.test(content)
    ? content.replace(/^VITE_UI_VERSION=.*$/m, line)
    : `${line}\n${content}`;

  fs.writeFileSync(absolute, next.endsWith('\n') ? next : `${next}\n`, 'utf8');
}

const version = resolveTargetVersion();
if (!VERSION_RE.test(version)) {
  console.error(`Versão inválida: ${version}. Use YYYY.MM.DD.N (N = 0-9).`);
  process.exit(1);
}

for (const file of ENV_FILES) {
  upsertUiVersion(file, version);
  console.log(`updated ${file} -> ${version}`);
}
