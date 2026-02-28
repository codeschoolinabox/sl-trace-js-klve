# verify-options — Architecture & Decisions

## Why this exists

JSON Schema (draft-07) cannot express cross-field constraints — e.g. "field A and
field B are mutually exclusive", or "if X is set, Y must also be set". Those constraints
live here, enforced after the API layer has already validated the schema and filled defaults.

## Why a folder?

Keeps validation logic, local types, and tests co-located and out of `src/`. If semantic
constraints grow complex, each constraint can get its own helper file here.

## Constraints

CHANGEME: list each constraint enforced and why JSON Schema alone is insufficient.
