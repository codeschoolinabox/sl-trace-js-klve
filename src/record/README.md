# record/

JavaScript tracer core. Exposes one function: `record(code, config)`.

## What this directory contains

```
record/
  index.ts          ← Public interface. The RecordFunction adapter. Edit this.
  tracer.ts         ← Babel instrumentation engine. External code — do not edit.
  filter-steps.ts   ← Step filtering logic. External code — do not edit.
  ast-map.ts        ← AST node-type → filter key mapping. External code — do not edit.
  types.ts          ← Internal types (RawStep, etc.). External code — do not edit.
  babel-standalone.d.ts ← Type declarations for @babel/standalone. Do not edit.
  tests/
    record.test.ts
    filter-steps.test.ts
```

## External Code

`tracer.ts`, `filter-steps.ts`, `ast-map.ts`, and `types.ts` are pre-existing code by
**Kelley van Evert** ([jsviz.klve.nl](https://jsviz.klve.nl)). They are not owned by
this package.

These files are excluded from linting (ESLint global ignores) and TypeScript strict
checking (`// @ts-nocheck` on `tracer.ts`). Do not modify them — they are the
tracer engine, not our code.

If you need to change how the tracer behaves, do it in `index.ts` by pre/post-processing
the steps, or open an issue upstream.

## The Pipeline

```
record(code, { meta, options })
  └─ trace(code, { maxSteps, maxTime })   ← tracer.ts (Babel instrumentation + execution)
       └─ filterSteps(rawSteps, filter)   ← filter-steps.ts (post-execution filter)
            └─ renumber steps (1-indexed) ← index.ts
```

1. **`tracer.ts`** — Instruments code with Babel, executes it in a sandboxed function,
   collects one step per AST node event (before/after). Enforces `maxSteps` and
   `maxTime` limits.
2. **`filter-steps.ts`** — Applies post-trace filtering from `options`: removes excluded
   AST node types (top-level toggles like `loops`, `declarations`), name-filtered steps
   (`options.filter.names`), timing-filtered steps (`options.filter.timing`), and strips
   data fields (`options.filter.data`).
3. **`index.ts`** — Adapter: converts tracer errors to `@study-lenses/tracing` error
   classes (`ParseError`, `RuntimeError`, `LimitExceededError`), renumbers steps to
   1-indexed, satisfies the `RecordFunction` contract.

## What `index.ts` exposes

`record(code, { meta, options })` — the `RecordFunction` as required by
`@study-lenses/tracing`. Called by the tracing wrappers after schema validation and
options verification.

## Tests

- `record.test.ts` — integration tests through `record()`: real code strings, checks
  step structure, filter behaviour, error propagation
- `filter-steps.test.ts` — unit tests for `filterSteps()` directly: node type filters,
  name filters, timing filters, data field stripping
