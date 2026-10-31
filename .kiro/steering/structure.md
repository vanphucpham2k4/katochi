# Project Structure

```
katochi/
├── manifest.json            # Chrome MV3 manifest (permissions, entry points)
├── vite.config.ts           # Build config (@crxjs/vite-plugin + manifest)
├── vitest.config.ts         # Test config (jsdom env, setup file)
├── tsconfig.json            # Strict TS config (noEmit, src + tests)
├── src/
│   ├── background/
│   │   └── service-worker.ts   # MV3 service worker; forwards action click to content script
│   ├── content/
│   │   └── content-script.ts   # Entry point; owns Mascot instance, routes runtime messages
│   ├── mascot/
│   │   ├── mascot.ts           # Mascot controller (Shadow DOM host, movement, state reflection)
│   │   ├── mascot-state-machine.ts  # Finite-state machine for the 5 lifecycle states
│   │   ├── mascot-movement.ts  # CSS-transform-based floating with viewport-edge bouncing
│   │   ├── mascot-styles.ts    # CSS string injected into the mascot's Shadow DOM
│   │   └── index.ts            # Barrel re-export for the mascot module
│   └── types/
│       ├── mascot.ts           # MascotState enum, MascotPosition, MascotMovementConfig
│       ├── actions.ts          # Discriminated union of validated actions (Action type)
│       ├── commands.ts        # Natural-language command parsing types (ParsedCommand, ParseResult)
│       ├── context.ts        # Page context & target resolution types (TargetKind, Target, PageContext)
│       ├── messaging.ts       # Service worker <-> content script messages (KatochiMessage union)
│       ├── modifications.ts   # Modification tracking records for Undo/Exorcise
│       └── index.ts           # Barrel re-export of all types
└── tests/
    ├── setup.ts              # Global chrome.* API mock, runs before each test
    ├── mascot.test.ts        # Mascot controller tests (uses fake timers)
    ├── mascot-state-machine.test.ts  # State machine transition tests
    ├── mascot-movement.test.ts       # Movement/edge-bounce/speed tests
    └── types.test.ts         # Smoke tests for type system & test environment
```

## Architecture Notes

- **Single source of truth for types**: everything lives in `src/types/` and is consumed via the `src/types/index.ts` barrel. Import from `'../types'`, not individual type files.
- **Mascot isolation**: the mascot renders inside a Shadow DOM (`mode: 'open'`) attached to a host div with id `katochi-mascot-host`. All mascot CSS is a string constant (`mascot-styles.ts`), not a stylesheet file.
- **Message flow**: extension action click -> service worker -> `tabs.sendMessage` -> content script `onMessage` listener -> `Mascot` methods.
- **State-driven UI**: the `MascotStateMachine` emits state changes to listeners; the `Mascot` controller reacts by toggling movement speed, mounting/unmounting the DOM, and setting `data-state` for CSS.
- **Planned components** (referenced in type docs, not yet implemented): Page Context Analyzer, Target Resolver, command parser, Action Engine, DOM Controller, chat bubble.
