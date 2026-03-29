#!/usr/bin/env bash
# Run every linter/checker — mirrors what CI does.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "── ESLint · Stylelint · Prettier · markdownlint (site) ─────────────────"
cd "$ROOT/site" && npm run lint

echo ""
echo "── markdownlint (full repo) ─────────────────────────────────────────────"
cd "$ROOT" && "$ROOT/site/node_modules/.bin/markdownlint-cli2"

echo ""
echo "── yamllint ─────────────────────────────────────────────────────────────"
cd "$ROOT"
if command -v yamllint &>/dev/null; then
  yamllint .pages.yml .github/workflows/
else
  echo "  yamllint not found — skipping (install: pip install yamllint)"
fi

echo ""
echo "── astro check (TypeScript / type errors) ───────────────────────────────"
cd "$ROOT/site" && npm run check

echo ""
echo "✓  all checks passed"
