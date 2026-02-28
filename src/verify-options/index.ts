/**
 * @file Semantic validation for js-klve options.
 * Called AFTER JSON Schema validation and default-filling by the API layer.
 */

import { OptionsSemanticInvalidError } from '@study-lenses/tracing';

import type { NameFilter } from './types.js';

/**
 * Semantic validation for js-klve options.
 *
 * Enforced constraint: `filter.names.include` and `filter.names.exclude` are
 * mutually exclusive. Providing both is almost certainly a mistake — the schema
 * cannot express this constraint, so we enforce it here.
 *
 * @param options - Fully-filled options (passed by API layer after schema validation)
 * @throws {OptionsSemanticInvalidError} if both `filter.names.include` and
 *   `filter.names.exclude` are non-empty
 */
function verifyOptions(options: unknown): void {
  if (typeof options !== 'object' || options === null) return;
  const { filter } = options as Record<string, unknown>;
  if (typeof filter !== 'object' || filter === null) return;
  const names = (filter as Record<string, unknown>).names as NameFilter | undefined;
  if (!names) return;

  const hasInclude = Array.isArray(names.include) && names.include.length > 0;
  const hasExclude = Array.isArray(names.exclude) && names.exclude.length > 0;

  if (hasInclude && hasExclude) {
    throw new OptionsSemanticInvalidError(
      'filter.names.include and filter.names.exclude are mutually exclusive — provide one or the other',
    );
  }
}

export default verifyOptions;
