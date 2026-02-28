/**
 * @file Type definitions for this tracer's steps and options.
 *
 * CHANGEME: replace with the actual shapes your tracer engine produces.
 */

/** Options accepted by this tracer (mirrors options.schema.json). */
export type TracerOptions = Record<string, unknown>;

/** A single step in the execution trace. */
export type TracerStep = Record<string, unknown>;
