import type { SkillStmt } from '../ast/index.js';
import type { Environment } from './Environment.js';

/**
 * VibeScript Runtime Values
 *
 * All possible values that can exist at runtime:
 * - Primitives: string, number, boolean, null
 * - Complex: arrays, functions (skills)
 */

/**
 * VibeCallable - Interface for callable values (functions/skills)
 */
export interface VibeCallable {
  readonly arity: number;
  readonly name: string;
  call(interpreter: unknown, args: VibeValue[]): VibeValue;
}

/**
 * VibeFunction - User-defined function (skill)
 * Captures the closure environment for lexical scoping
 */
export class VibeFunction implements VibeCallable {
  constructor(
    public readonly declaration: SkillStmt,
    public readonly closure: Environment
  ) {}

  get arity(): number {
    return this.declaration.params.length;
  }

  get name(): string {
    return this.declaration.name;
  }

  call(interpreter: unknown, args: VibeValue[]): VibeValue {
    // This will be called by the interpreter
    // The actual implementation is in the interpreter
    throw new Error('VibeFunction.call should be overridden by interpreter');
  }

  toString(): string {
    return `<skill ${this.name}>`;
  }
}

/**
 * VibeNativeFunction - Built-in function
 */
export class VibeNativeFunction implements VibeCallable {
  constructor(
    public readonly name: string,
    public readonly arity: number,
    private readonly fn: (args: VibeValue[]) => VibeValue
  ) {}

  call(_interpreter: unknown, args: VibeValue[]): VibeValue {
    return this.fn(args);
  }

  toString(): string {
    return `<native skill ${this.name}>`;
  }
}

/**
 * VibeArray - Runtime array type
 */
export class VibeArray {
  constructor(public elements: VibeValue[]) {}

  get(index: number): VibeValue {
    if (index < 0 || index >= this.elements.length) {
      return null;
    }
    return this.elements[index];
  }

  set(index: number, value: VibeValue): void {
    if (index >= 0 && index < this.elements.length) {
      this.elements[index] = value;
    }
  }

  get length(): number {
    return this.elements.length;
  }

  push(value: VibeValue): void {
    this.elements.push(value);
  }

  pop(): VibeValue {
    return this.elements.pop() ?? null;
  }

  toString(): string {
    return `[${this.elements.map(e => stringify(e)).join(', ')}]`;
  }
}

/**
 * VibeValue - Union type of all possible runtime values
 */
export type VibeValue =
  | string
  | number
  | boolean
  | null
  | VibeArray
  | VibeCallable;

/**
 * Type guard: Check if value is a callable (function/skill)
 */
export function isCallable(value: VibeValue): value is VibeCallable {
  return value !== null &&
         typeof value === 'object' &&
         'call' in value &&
         typeof value.call === 'function';
}

/**
 * Type guard: Check if value is an array
 */
export function isArray(value: VibeValue): value is VibeArray {
  return value instanceof VibeArray;
}

/**
 * Check if value is truthy
 */
export function isTruthy(value: VibeValue): boolean {
  if (value === null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return value.length > 0;
  if (value instanceof VibeArray) return value.length > 0;
  return true;
}

/**
 * Check if two values are equal
 */
export function isEqual(a: VibeValue, b: VibeValue): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;

  if (typeof a !== typeof b) return false;

  if (a instanceof VibeArray && b instanceof VibeArray) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a.get(i), b.get(i))) return false;
    }
    return true;
  }

  return a === b;
}

/**
 * Get the type name of a value
 */
export function getTypeName(value: VibeValue): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (value instanceof VibeArray) return 'array';
  if (isCallable(value)) return 'skill';
  return 'unknown';
}

/**
 * Convert a value to string for display
 */
export function stringify(value: VibeValue): string {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'bet' : 'cap';
  if (value instanceof VibeArray) return value.toString();
  if (isCallable(value)) return value.toString();
  return String(value);
}
