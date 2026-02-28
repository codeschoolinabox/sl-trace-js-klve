# @study-lenses/trace-js-klve

[![npm version](https://img.shields.io/npm/v/@study-lenses/trace-js-klve.svg)](https://www.npmjs.com/package/@study-lenses/trace-js-klve)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> JavaScript execution tracer for `@study-lenses/tracing` — instruments JS/MJS/CJS code
> via Babel and returns step-by-step execution traces.

## Pedagogical Purpose

**Neutral infrastructure:** This package provides raw JavaScript execution traces for
educational tool developers. It makes no pedagogical decisions — those belong in the
tools that consume it.

The trace data is deliberately granular: every expression evaluation, variable read,
function call, and control-flow step is captured. Educational tools decide which
subset to show and how to present it.

## Who Is This For

**Primary — Educational tool developers:** Building Study Lenses, custom analysis tools,
or other learning environments that need JS execution traces.

**Secondary — CS instructors:** Using this package directly to build course-specific
debugging aids or step-through visualizations.

## Install

```bash
npm install @study-lenses/trace-js-klve
```

## Quick Start

```typescript
import trace from '@study-lenses/trace-js-klve';

const steps = await trace('let x = 1 + 2; console.log(x);');
console.log(steps);
// → [{ step: 1, category: 'expression', type: 'BinaryExpression', ... }, ...]
```

## API Summary

`@study-lenses/trace-js-klve` pre-configures all four `@study-lenses/tracing` wrappers
with the js-klve tracer:

| Export | Description |
|--------|-------------|
| `trace(code, config?)` | Positional args, throws on error. Default export. |
| `tracify` | Chainable builder with tracer pre-set, throws on error. |
| `embody({ code, config? })` | Keyed args, returns Result (no throw). |
| `embodify({ code?, config? })` | Immutable chainable builder, returns Result. |

See [DOCS.md](./DOCS.md) for the full API reference and filter options.

## Design Principles

### What this package provides

- Step-by-step execution traces for JS/MJS/CJS code
- Babel-based instrumentation (AST-level, no runtime monkey-patching)
- Configurable post-trace filtering (by node type, name, timing, data fields)
- The four standard `@study-lenses/tracing` wrappers, pre-bound to this tracer

### What this package does NOT do

- Make pedagogical decisions (what to show, how to explain)
- Persist or accumulate traces across calls
- Support languages other than JS/MJS/CJS

## Architecture

```
code → Babel instrumentation → execution → raw steps → filter → JsKlveStep[]
```

The tracer internals (`record/tracer.ts`, `record/filter-steps.ts`, etc.) are
pre-existing code by Kelley van Evert ([jsviz.klve.nl](https://jsviz.klve.nl)),
wrapped by `record/index.ts` which adapts the output to the `@study-lenses/tracing`
`RecordFunction` contract.

See [DEV.md](./DEV.md) for full architecture, conventions, and the TDD workflow.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [DEV.md](./DEV.md).

## License

MIT © 2025 Evan Cole
