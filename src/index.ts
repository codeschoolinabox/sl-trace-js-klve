/**
 * @file Package entry point.
 *
 * Assembles the TracerModule from static data and the record function,
 * wires it into @study-lenses/tracing, and re-exports the resulting
 * trace wrappers. Wire-up only — do not add logic here.
 */

import tracing from '@study-lenses/tracing';
import type { RecordFunction } from '@study-lenses/tracing';

import id from './id.js';
import langs from './langs.js';
import optionsSchema from './options-schema.js';
import record from './record/index.js';
import deepFreeze from './utils/deep-freeze.js';
import verifyOptions from './verify-options/index.js';

const tracer = Object.freeze({
  id,
  langs: Object.freeze(langs),
  record: record as RecordFunction,
  optionsSchema: deepFreeze(optionsSchema),
  verifyOptions,
});

const { trace, tracify, embody, embodify } = tracing(tracer);

export { trace, tracify, embody, embodify };
export { tracer };
export default trace;
