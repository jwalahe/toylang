import { VibeNativeFunction, VibeArray, type VibeValue, isArray, stringify, getTypeName } from './Values.js';
import type { Environment } from './Environment.js';
import { RuntimeError } from '../errors/Errors.js';

/**
 * Built-in Functions for VibeScript
 *
 * These are native functions available in all VibeScript programs.
 * Design: Factory pattern - creates and registers built-ins
 */

/**
 * Register all built-in functions in the given environment
 */
export function registerBuiltIns(env: Environment): void {
  // Array functions
  env.define('size', createSizeFunction(), false);
  env.define('push', createPushFunction(), false);
  env.define('pop', createPopFunction(), false);

  // Type functions
  env.define('type', createTypeFunction(), false);

  // Conversion functions
  env.define('num', createNumFunction(), false);
  env.define('str', createStrFunction(), false);

  // Math functions
  env.define('abs', createAbsFunction(), false);
  env.define('floor', createFloorFunction(), false);
  env.define('ceil', createCeilFunction(), false);
  env.define('round', createRoundFunction(), false);
  env.define('min', createMinFunction(), false);
  env.define('max', createMaxFunction(), false);
  env.define('random', createRandomFunction(), false);
}

// === ARRAY FUNCTIONS ===

function createSizeFunction(): VibeNativeFunction {
  return new VibeNativeFunction('size', 1, (args) => {
    const value = args[0];
    if (isArray(value)) {
      return value.length;
    }
    if (typeof value === 'string') {
      return value.length;
    }
    throw new RuntimeError(`size() expects an array or string, got ${getTypeName(value)}`);
  });
}

function createPushFunction(): VibeNativeFunction {
  return new VibeNativeFunction('push', 2, (args) => {
    const arr = args[0];
    const value = args[1];
    if (!isArray(arr)) {
      throw new RuntimeError(`push() expects an array as first argument, got ${getTypeName(arr)}`);
    }
    arr.push(value);
    return null;
  });
}

function createPopFunction(): VibeNativeFunction {
  return new VibeNativeFunction('pop', 1, (args) => {
    const arr = args[0];
    if (!isArray(arr)) {
      throw new RuntimeError(`pop() expects an array, got ${getTypeName(arr)}`);
    }
    return arr.pop();
  });
}

// === TYPE FUNCTIONS ===

function createTypeFunction(): VibeNativeFunction {
  return new VibeNativeFunction('type', 1, (args) => {
    return getTypeName(args[0]);
  });
}

// === CONVERSION FUNCTIONS ===

function createNumFunction(): VibeNativeFunction {
  return new VibeNativeFunction('num', 1, (args) => {
    const value = args[0];
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        throw new RuntimeError(`Cannot convert "${value}" to number`);
      }
      return parsed;
    }
    if (typeof value === 'boolean') return value ? 1 : 0;
    throw new RuntimeError(`Cannot convert ${getTypeName(value)} to number`);
  });
}

function createStrFunction(): VibeNativeFunction {
  return new VibeNativeFunction('str', 1, (args) => {
    return stringify(args[0]);
  });
}

// === MATH FUNCTIONS ===

function createAbsFunction(): VibeNativeFunction {
  return new VibeNativeFunction('abs', 1, (args) => {
    const value = args[0];
    if (typeof value !== 'number') {
      throw new RuntimeError(`abs() expects a number, got ${getTypeName(value)}`);
    }
    return Math.abs(value);
  });
}

function createFloorFunction(): VibeNativeFunction {
  return new VibeNativeFunction('floor', 1, (args) => {
    const value = args[0];
    if (typeof value !== 'number') {
      throw new RuntimeError(`floor() expects a number, got ${getTypeName(value)}`);
    }
    return Math.floor(value);
  });
}

function createCeilFunction(): VibeNativeFunction {
  return new VibeNativeFunction('ceil', 1, (args) => {
    const value = args[0];
    if (typeof value !== 'number') {
      throw new RuntimeError(`ceil() expects a number, got ${getTypeName(value)}`);
    }
    return Math.ceil(value);
  });
}

function createRoundFunction(): VibeNativeFunction {
  return new VibeNativeFunction('round', 1, (args) => {
    const value = args[0];
    if (typeof value !== 'number') {
      throw new RuntimeError(`round() expects a number, got ${getTypeName(value)}`);
    }
    return Math.round(value);
  });
}

function createMinFunction(): VibeNativeFunction {
  return new VibeNativeFunction('min', 2, (args) => {
    const a = args[0];
    const b = args[1];
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new RuntimeError(`min() expects two numbers`);
    }
    return Math.min(a, b);
  });
}

function createMaxFunction(): VibeNativeFunction {
  return new VibeNativeFunction('max', 2, (args) => {
    const a = args[0];
    const b = args[1];
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new RuntimeError(`max() expects two numbers`);
    }
    return Math.max(a, b);
  });
}

function createRandomFunction(): VibeNativeFunction {
  return new VibeNativeFunction('random', 0, () => {
    return Math.random();
  });
}
