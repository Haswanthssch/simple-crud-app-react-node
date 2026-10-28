// Dependency security regression test.
//
// Guards the CVE fixes applied to the frontend and backend dependency trees
// (see the repo's dependency update notes). It reads the committed lockfiles
// and asserts the resolved versions of the vulnerable transitive packages
// match the fixed versions. It fails on the pre-fix lockfiles and passes once
// the fixes are applied, so it documents the security baseline directly in the
// repository without needing a running server or database.

const fs = require('fs');
const path = require('path');

// --- tiny semver helpers (numeric segments only) ---
function parseVersion(v) {
  return String(v)
    .split('.')
    .map((n) => parseInt(n, 10));
}

function gte(a, b) {
  const A = parseVersion(a);
  const B = parseVersion(b);
  const len = Math.max(A.length, B.length);
  for (let i = 0; i < len; i += 1) {
    const x = A[i] || 0;
    const y = B[i] || 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return true;
}

const repoRoot = path.resolve(__dirname, '..', '..');

function readPackages(dir) {
  const lockPath = path.join(repoRoot, dir, 'package-lock.json');
  return JSON.parse(fs.readFileSync(lockPath, 'utf8')).packages;
}

const frontend = readPackages('frontend');
const backend = readPackages('backend');

describe('dependency security fixes', () => {
  const atLeast = (packages, entry, version) => {
    expect(packages[entry]).toBeDefined();
    expect(gte(packages[entry].version, version)).toBe(true);
  };
  const exactly = (packages, entry, version) => {
    expect(packages[entry]).toBeDefined();
    expect(packages[entry].version).toBe(version);
  };

  test('frontend vulnerable transitive dependencies are pinned to fixed versions', () => {
    atLeast(frontend, 'node_modules/jsonpath', '1.3.0');
    atLeast(frontend, 'node_modules/proxy-addr', '2.0.8');
    atLeast(frontend, 'node_modules/websocket-driver', '0.7.5');
    atLeast(frontend, 'node_modules/@babel/plugin-transform-modules-systemjs', '7.29.4');
    atLeast(frontend, 'node_modules/axios', '1.15.1');
    atLeast(frontend, 'node_modules/body-parser', '2.4.0');
    exactly(frontend, 'node_modules/filelist/node_modules/brace-expansion', '5.0.10');
    exactly(frontend, 'node_modules/sucrase/node_modules/brace-expansion', '5.0.10');
    atLeast(frontend, 'node_modules/browserslist', '4.28.7');
    atLeast(frontend, 'node_modules/compression', '1.8.2');
    exactly(frontend, 'node_modules/fast-uri', '2.4.5');
    atLeast(frontend, 'node_modules/flatted', '3.4.2');
    exactly(frontend, 'node_modules/form-data', '2.5.6');
    exactly(frontend, 'node_modules/sucrase/node_modules/glob', '11.1.0');
    exactly(frontend, 'node_modules/js-yaml', '4.3.2');
    atLeast(frontend, 'node_modules/launch-editor', '2.14.2');
    atLeast(frontend, 'node_modules/lodash', '4.18.0');
    exactly(frontend, 'node_modules/sucrase/node_modules/minimatch', '10.2.1');
  });

  test('backend vulnerable transitive dependencies are pinned to fixed versions', () => {
    atLeast(backend, 'node_modules/proxy-addr', '2.0.8');
    atLeast(backend, 'node_modules/body-parser', '2.4.0');
  });
});
