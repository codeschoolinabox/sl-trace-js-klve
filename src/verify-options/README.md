# verify-options

Semantic validation called by the API layer after JSON Schema validation and default-filling.

Enforces constraints JSON Schema cannot express — currently: `filter.names.include` and
`filter.names.exclude` are mutually exclusive.

## Files

- `index.ts` — `verifyOptions(options)` — throws `OptionsSemanticInvalidError` on violations
- `types.ts` — `NameFilter` type (local, avoids cross-boundary import from `record/`)
- `tests/` — unit tests for semantic validation
