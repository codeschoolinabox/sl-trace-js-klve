# record — Architecture & Decisions

CHANGEME: explain the design of this module for contributors.

## Responsibility

This module owns the boundary between `@study-lenses/tracing`'s `RecordFunction`
contract and the actual tracer engine. `index.ts` is the adapter; the engine lives
alongside it (or in a separate file).

## Why a folder?

Grouping engine code, adapter, types, and tests under `record/` keeps CHANGEME-specific
implementation details from polluting `src/`. New engine files belong here.

## Error mapping

CHANGEME: explain how engine-specific errors are mapped to the standard error types
(`ParseError`, `RuntimeError`, `LimitExceededError`) from `@study-lenses/tracing`.

## Step numbering

CHANGEME: explain any step indexing decisions (e.g. 0-indexed internally, 1-indexed output).
