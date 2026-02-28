/**
 * @file Local types for verify-options.
 * Keep these local — avoids cross-boundary import from record/.
 */

/** Fields validated by the mutual-exclusion constraint. */
export type NameFilter = {
  readonly include?: readonly string[];
  readonly exclude?: readonly string[];
};
