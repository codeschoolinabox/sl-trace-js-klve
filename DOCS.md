# @study-lenses/CHANGEME — Architecture & Decisions

## Why this tracer exists

CHANGEME: what language/runtime does this instrument, and why as a separate package?

## Architecture

This package implements the `TracerModule` contract from `@study-lenses/tracing`:

```text
code (string)
  → record/index.ts    ← engine adapter (owned here)
  → record/<engine>    ← tracer engine (CHANGEME: owned here or external)
  → TracerStep[]       ← returned via @study-lenses/tracing wrappers
```

`src/index.ts` is wire-up only — no logic. All tracer logic lives in `record/`.

## Key decisions

### Why options are JSON Schema + verifyOptions

JSON Schema (draft-07) validates structure and types. `verify-options/` handles
constraints the schema cannot express (cross-field rules). Separating them keeps
the schema machine-readable for tooling while still enforcing semantic rules.

### CHANGEME: add other decisions

TODO: what non-obvious choices did you make in the engine or options design?

## What this package deliberately does NOT do

This package instruments and executes code — it does not interpret, display, or
pedagogically frame the resulting trace. That is the consumer's responsibility.
