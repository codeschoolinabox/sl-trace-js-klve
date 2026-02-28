/**
 * @file Entry point for the record function.
 *
 * Adapts the tracer engine to the @study-lenses/tracing RecordFunction interface.
 * Signature: record(code, { meta, options })
 *
 * CHANGEME: replace the throw with a real implementation.
 * See sl-trace-js-klve/src/record/index.ts for a reference.
 */

// CHANGEME: uncomment the errors your engine can raise:
// import { ParseError, RuntimeError, LimitExceededError } from '@study-lenses/tracing';
import type { MetaConfig } from '@study-lenses/tracing';

import type { TracerOptions, TracerStep } from './types.js';

/**
 * Records an execution trace for the given source code.
 *
 * @param _code - Source code to trace
 * @param _config - Configuration with meta (limits) and options (tracer-specific)
 * @returns Promise resolving to an array of trace steps
 */
function record(
  _code: string,
  _config: { readonly meta: MetaConfig; readonly options: TracerOptions },
): Promise<readonly TracerStep[]> {
  return Promise.reject(new Error('CHANGEME: implement record'));
}

export default record;
