# verify-options — Architecture & Decisions

## Why this exists

JSON Schema (draft-07) cannot express cross-field constraints. The js-klve options
have one such constraint: `filter.names.include` and `filter.names.exclude` are
mutually exclusive — providing both is almost certainly a user mistake, and silent
ignore-one-of-them behaviour would be confusing. This constraint is enforced here,
after the API layer has validated the schema and filled defaults.

## Why a folder?

Keeps validation logic, local types, and tests co-located and out of `src/`. If new
constraints are added, each can get its own helper file here.

## Constraints

### `filter.names.include` / `filter.names.exclude` mutual exclusion

`include` defines a whitelist (only steps mentioning these names pass through).
`exclude` defines a blacklist (steps mentioning these names are removed). Applying
both simultaneously is contradictory and not recoverable by picking one silently —
so we throw `OptionsSemanticInvalidError` instead.

JSON Schema cannot express "at most one of these two arrays may be non-empty" —
that would require `if/then/else` with `maxItems: 0`, which draft-07 supports
technically but is unreadable and fragile. A code check is clearer.
