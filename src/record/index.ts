/**
 * @file Main entry point for js-klve tracer.
 *
 * Adapts the tracer to @study-lenses/tracing TracerModule interface.
 * Signature: record(code, { meta, options })
 */

import { LimitExceededError, ParseError, RuntimeError } from '@study-lenses/tracing';
import type { MetaConfig } from '@study-lenses/tracing';

import filterSteps from './filter-steps.js';
import trace from './trace.js';
import type { JsKlveOptions, JsKlveStep } from './types.js';

/**
 * Records execution trace for JavaScript code.
 *
 * Uses Babel to instrument code, executes it, and returns step-by-step
 * trace data. Applies post-execution filtering based on options.
 *
 * @param code - JavaScript source code to trace
 * @param config - Configuration object with meta (limits) and options (filter)
 * @returns Promise resolving to filtered trace steps
 * @throws ParseError if code has syntax errors
 * @throws RuntimeError if code has runtime errors
 * @throws LimitExceededError if trace exceeds meta.max.steps or meta.max.time
 */
// eslint-disable-next-line @typescript-eslint/require-await -- RecordFunction contract requires Promise; trace() is sync
async function record(
  code: string,
  config: { readonly meta: MetaConfig; readonly options: JsKlveOptions },
): Promise<readonly JsKlveStep[]> {
  const { meta, options } = config;

  // Trace the code with limits enforced during execution
  let rawSteps;
  try {
    rawSteps = trace(code, {
      maxSteps: meta.max.steps,
      maxTime: meta.max.time,
    });
  } catch (error) {
    // Let tracing errors pass through (LimitExceededError from report())
    if (error instanceof LimitExceededError) {
      throw error;
    }

    // Convert Babel syntax errors to ParseError.
    // Babel standalone attaches a `.loc` property to SyntaxError with { line, column }.
    // Prefer that over message parsing — it's stable and doesn't depend on message format.
    type BabelSyntaxError = SyntaxError & {
      readonly loc?: { readonly line: number; readonly column: number };
    };
    if (error instanceof SyntaxError) {
      const babelLoc = (error as BabelSyntaxError).loc;
      const loc = babelLoc ?? { line: 1, column: 0 };
      throw new ParseError(error.message, loc);
    }

    // Re-throw other errors as RuntimeError
    if (error instanceof Error) {
      throw new RuntimeError(error.message, { line: 1, column: 0 });
    }

    throw error;
  }

  // Apply filter configuration from options
  const filteredSteps = filterSteps(rawSteps, options ?? {});

  // Renumber steps to start at 1 (tracer uses 0-indexed internally)
  const renumberedSteps = filteredSteps.map((step, index) => ({
    ...step,
    step: index + 1,
  }));

  return renumberedSteps;
}

export default record;
