/**
 * Tests for js-klve verifyOptions.
 *
 * Validates semantic constraints that JSON Schema cannot express.
 */
import { OptionsSemanticInvalidError } from '@study-lenses/tracing';
import { describe, it, expect } from 'vitest';

import verifyOptions from '../index.js';

describe('verifyOptions', () => {
  describe('passes without throwing', () => {
    it('accepts options with include only', () => {
      expect(() => {
        verifyOptions({ filter: { names: { include: ['x'] } } });
      }).not.toThrow();
    });

    it('accepts options with exclude only', () => {
      expect(() => {
        verifyOptions({ filter: { names: { exclude: ['x'] } } });
      }).not.toThrow();
    });

    it('accepts options with neither include nor exclude', () => {
      expect(() => {
        verifyOptions({ filter: { names: {} } });
      }).not.toThrow();
    });

    it('accepts empty arrays for both include and exclude', () => {
      expect(() => {
        verifyOptions({ filter: { names: { include: [], exclude: [] } } });
      }).not.toThrow();
    });

    it('accepts options with no filter key', () => {
      expect(() => {
        verifyOptions({});
      }).not.toThrow();
    });

    it('accepts options with filter but no names key', () => {
      expect(() => {
        verifyOptions({ filter: { timing: { before: false } } });
      }).not.toThrow();
    });

    it('accepts a non-object (early return path)', () => {
      expect(() => {
        verifyOptions('not an object');
      }).not.toThrow();
    });

    it('accepts null (early return path)', () => {
      expect(() => {
        verifyOptions(null);
      }).not.toThrow();
    });
  });

  describe('throws on mutual exclusivity violation', () => {
    it('throws OptionsSemanticInvalidError when both include and exclude are non-empty', () => {
      expect(() => {
        verifyOptions({ filter: { names: { include: ['x'], exclude: ['y'] } } });
      }).toThrow(OptionsSemanticInvalidError);
    });

    it('error message identifies the conflicting fields', () => {
      expect(() => {
        verifyOptions({ filter: { names: { include: ['x'], exclude: ['y'] } } });
      }).toThrow('filter.names.include and filter.names.exclude are mutually exclusive');
    });
  });
});
