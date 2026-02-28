/**
 * @file Semantic validation for tracer options.
 * Called AFTER JSON Schema validation and default-filling by the API layer.
 *
 * Add constraints here that JSON Schema cannot express — e.g. mutually
 * exclusive fields, cross-field dependencies.
 * Throw OptionsSemanticInvalidError for any violation.
 *
 * If this tracer has no semantic constraints beyond JSON Schema, leave this as a no-op.
 */

// CHANGEME: uncomment when adding semantic constraints:
// import { OptionsSemanticInvalidError } from '@study-lenses/tracing';

/**
 * Semantic validation for tracer options.
 *
 * @param _options - Fully-filled options (passed by API layer after schema validation)
 * @throws {OptionsSemanticInvalidError} if options violate semantic constraints
 */
function verifyOptions(_options: unknown): void {
  // CHANGEME: add semantic validation, or leave empty if none needed
}

export default verifyOptions;
