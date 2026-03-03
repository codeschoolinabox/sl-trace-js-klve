# @study-lenses/trace-js-klve — Architecture & Decisions

## Why this tracer exists

Instruments JavaScript source code using the Babel AST and the klve engine by
Kelley van Evert ([jsviz.klve.nl](https://jsviz.klve.nl)), returning a step-by-step
execution trace. Exists as a separate package so other `@study-lenses` tracers
(Python, WASM, etc.) can follow the same `TracerModule` contract without coupling.

## Architecture

```text
code (string)
  → record/index.ts        ← adapter (error mapping, step renumbering)
  → record/trace.ts       ← Babel instrumentation + sandboxed execution (external)
  → record/filter-steps.ts ← post-trace filtering (external)
  → TracerStep[]           ← returned via @study-lenses/tracing wrappers
```

`src/index.ts` is wire-up only — no logic. All tracer logic lives in `record/`.

### Full Pipeline Diagram

```mermaid
flowchart TB
    consumer1["<b>CONSUMER PROGRAM</b><br/>(educational tool)<br/><br/>calls trace(tracer, code, config?)"]

    consumer1 -- "source code + partial config" --> prepareMeta

    subgraph wrapper ["@study-lenses/tracing — API WRAPPER"]
        direction TB

        subgraph validation ["VALIDATION (sync)"]
            direction TB
            prepareMeta["<b>Prepare meta config</b><br/>expand shorthand, fill defaults,<br/>validate against wrapper schema"]
            prepareOpts["<b>Prepare tracer options</b><br/>expand shorthand, fill defaults,<br/>validate against tracer schema<br/>(skipped if no optionsSchema)"]
            freezeConfig["<b>Freeze config</b><br/>deep-freeze resolved<br/>meta + options"]
            verifyOpts["<b>Verify options semantics</b><br/>cross-field constraints<br/>(skipped if no verifyOptions)"]

            prepareMeta --> prepareOpts --> freezeConfig --> verifyOpts
        end

        subgraph execution ["EXECUTION (async)"]
            direction TB
            executeTracer["<b>Execute tracer</b><br/>call record() with code +<br/>fully resolved frozen config"]
        end

        subgraph postprocessing ["POST-PROCESSING (sync)"]
            direction TB
            validateSteps["<b>Validate steps</b><br/>array of POJOs, 1-indexed step,<br/>valid source locations"]
            freezeOutput["<b>Freeze output</b><br/>deep-freeze steps for<br/>immutable consumer access"]

            validateSteps --> freezeOutput
        end

        verifyOpts -- "code + frozen config" --> executeTracer
        executeTracer -- "raw steps" --> validateSteps
    end

    freezeOutput -- "frozen steps" --> consumer2
    consumer2["<b>CONSUMER PROGRAM</b><br/>(receives frozen steps)"]

    subgraph tracermod ["YOUR TRACER MODULE  ★ = you implement this"]
        direction TB
        tid["<b>★ id</b>  (required)<br/>unique identifier; used for<br/>cache invalidation"]
        tlangs["<b>★ langs</b>  (required)<br/>supported file extensions"]
        tschema["<b>★ optionsSchema</b>  (optional)<br/>JSON Schema for tracer options"]
        tverify["<b>★ verifyOptions</b>  (optional)<br/>cross-field semantic checks"]
        trecord["<b>★ record</b>  (required)<br/>instruments + executes code,<br/>returns execution steps"]

        tid ~~~ tlangs
        tlangs ~~~ tschema
        tschema ~~~ tverify
        tverify ~~~ trecord
    end

    tschema -. "uses schema" .-> prepareOpts
    tverify -. "calls verify" .-> verifyOpts
    trecord -. "calls record" .-> executeTracer

    style wrapper fill:none,stroke:#333,stroke-width:3px
    style validation fill:none,stroke:#666,stroke-dasharray:5 5
    style execution fill:none,stroke:#666,stroke-dasharray:5 5
    style postprocessing fill:none,stroke:#666,stroke-dasharray:5 5
    style tracermod fill:#fff8e1,stroke:#f9a825,stroke-width:2px
    style consumer1 fill:#e3f2fd,stroke:#1565c0
    style consumer2 fill:#e3f2fd,stroke:#1565c0
```

## Key decisions

### Why Babel (`@babel/standalone`)

AST-based instrumentation gives step-level granularity — one step per expression
evaluation — without modifying the user's observable semantics. The alternative
(line-by-line stepping via a debugger protocol) is far more complex to set up and
less portable.

### Why the engine is treated as external

`trace.ts`, `filter-steps.ts`, `ast-map.ts`, and `types.ts` are pre-existing code
by Kelley van Evert. They are excluded from linting and TypeScript strict checking.
The adapter (`record/index.ts`) is the only file we own in `record/` — it maps
engine errors to standard error types and renumbers steps to 1-indexed.

### Why steps are 0-indexed internally and 1-indexed in output

The klve engine uses 0-indexed steps internally. Output is renumbered to 1-indexed
in `record/index.ts` because step 1 is the expected convention for consumers
(educational tools display "Step 1", not "Step 0").

### Why options use JSON Schema + verifyOptions

JSON Schema (draft-07) validates structure and types. `verify-options/` handles
the `filter.names.include` / `filter.names.exclude` mutual exclusion constraint,
which JSON Schema cannot express. Separating them keeps the schema machine-readable
for tooling while still enforcing semantic rules.

## What this package deliberately does NOT do

Does not interpret, display, or pedagogically frame the trace. That is the consumer's
responsibility. Does not own the klve engine — `record/index.ts` is an adapter only.
