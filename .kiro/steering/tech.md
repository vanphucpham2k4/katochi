# Tech Stack & Build

## Language & Runtime

- **TypeScript** (strict mode) targeting ES2022, compiled with `tsc --noEmit` for type checking only (Vite handles emission)
- **Chrome Extension Manifest V3** - service worker background, content script on `<all_urls>`
- Chrome APIs in use: `storage`, `activeTab`, `action.onClicked`, `tabs.sendMessage`, `runtime.onMessage`

## Build & Bundling

- **Vite 8** with **@crxjs/vite-plugin 3.0.0** - reads `manifest.json` and compiles the referenced service worker and content script entry points. Output goes to `dist/`.
- Vite config: `vite.config.ts` (build only; the crx plugin is excluded from tests)

## Testing

- **Vitest 5** with **jsdom** environment so DOM-touching code can be tested without a browser
- Test config lives in a separate `vitest.config.ts` to keep the crx plugin out of the test pipeline
- Global setup in `tests/setup.ts` provides an in-memory `chrome.*` API mock (storage, runtime, tabs, action)
- Tests import from `vitest` directly (`describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`)

## Common Commands

| Command | Description |
|---|---|
| `npm run dev` | Vite dev build (watch mode) |
| `npm run build` | Production build to `dist/` |
| `npm run test` | Run unit tests once (`vitest run`) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run typecheck` | Type-check with `tsc --noEmit` (no output) |

## TypeScript Conventions

- `verbatimModuleSyntax: true` - **always use `import type` for type-only imports** (enums like `MascotState` are values and use regular `import`)
- `strict: true` with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitOverride`
- `moduleResolution: "bundler"`, `module: "ESNext"`, `target: "ES2022"`
- `@types/chrome` provides Chrome extension API types

## Code Style

- 2-space indentation, double quotes for strings
- JSDoc comments on files, classes, and public members
- Each source file begins with a `/** ... */` block describing its purpose
- Named exports only (no default exports)
