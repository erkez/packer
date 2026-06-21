---
"@ekz/packer": patch
"@ekz/eslint-config-packer": patch
---

ESLint flat config fixes for TypeScript React consumers:

- Restore 0.16 behavior: turn off `react/prop-types` and `react/display-name` globally (not JS-only) after extending `@ekz/packer/recommended`.
- Register `eslint-plugin-react-hooks` for `**/*.{js,jsx,mjs,cjs,ts,tsx}` so consumers can override `react-hooks/exhaustive-deps` with a rules-only block — no plugin redeclaration or `fixupPluginRules` wrapper required.
