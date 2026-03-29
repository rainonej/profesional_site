#!/usr/bin/env bash
# Auto-fix everything that can be fixed — ESLint, Stylelint, Prettier, markdownlint.
# Note: yamllint and astro check are read-only; they have no --fix mode.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "── ESLint fix · Stylelint fix · Prettier write · markdownlint fix (site) ─"
cd "$ROOT/site" && npm run lint:fix

echo ""
echo "── markdownlint fix (full repo) ─────────────────────────────────────────"
cd "$ROOT" && "$ROOT/site/node_modules/.bin/markdownlint-cli2" --fix

echo ""
echo "✓  all fixers applied — run scripts/lint.sh to verify"
