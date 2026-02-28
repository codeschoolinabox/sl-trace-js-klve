# verify-options

Semantic validation called by the API layer after JSON Schema validation and default-filling.

Use this for constraints JSON Schema cannot express (e.g. mutually exclusive fields).
Leave `index.ts` as a no-op if the JSON Schema is sufficient.

## Files

- `index.ts` — `verifyOptions(options)` — throws `OptionsSemanticInvalidError` on violations
- `types.ts` — local types used for validation (avoids cross-boundary imports)
- `tests/` — unit tests for semantic validation
