# src/

Source for a `@study-lenses` tracer package. Implements the `TracerModule` contract
from `@study-lenses/tracing` — instrument + execute code, return steps.

## Structure

| Module | Purpose |
| --- | --- |
| `id.ts` | Unique tracer identifier (`'lang:engine'`) |
| `langs.ts` | File extensions this tracer handles |
| `options.schema.json` | JSON Schema for tracer options |
| `options-schema.ts` | Re-export wrapper for `options.schema.json` |
| `record/` | Instrumentation engine + RecordFunction adapter |
| `verify-options/` | Semantic validation (cross-field constraints) |
| `utils/` | Shared pure utilities (deep-clone, freeze, merge) |

## Conventions

- One default export per file; no barrel imports
- Types in `types.ts` per module
- Tests in `tests/` subdirectory
