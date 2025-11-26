import type { VibeValue } from './Values.js';
import { RuntimeError } from '../errors/Errors.js';

/**
 * Variable Entry - Stores a variable with its mutability flag
 */
interface VariableEntry {
  value: VibeValue;
  isConstant: boolean;
}

/**
 * Environment - Manages variable scopes
 *
 * Implements lexical scoping with parent chain.
 * Each environment can have a parent (enclosing) environment.
 *
 * Design Pattern: Chain of Responsibility
 * - Variable lookup walks up the parent chain
 * - Each scope can shadow variables from outer scopes
 */
export class Environment {
  private readonly values: Map<string, VariableEntry> = new Map();

  constructor(
    public readonly parent: Environment | null = null
  ) {}

  /**
   * Define a new variable in this scope
   */
  define(name: string, value: VibeValue, isConstant = false): void {
    this.values.set(name, { value, isConstant });
  }

  /**
   * Get a variable's value
   * Walks up parent chain if not found locally
   */
  get(name: string, line?: number, column?: number): VibeValue {
    const entry = this.values.get(name);
    if (entry !== undefined) {
      return entry.value;
    }

    if (this.parent !== null) {
      return this.parent.get(name, line, column);
    }

    throw RuntimeError.undefinedVariable(name, line, column);
  }

  /**
   * Assign a new value to an existing variable
   * Walks up parent chain if not found locally
   */
  assign(name: string, value: VibeValue, line?: number, column?: number): void {
    const entry = this.values.get(name);
    if (entry !== undefined) {
      if (entry.isConstant) {
        throw RuntimeError.constantReassignment(name, line, column);
      }
      entry.value = value;
      return;
    }

    if (this.parent !== null) {
      this.parent.assign(name, value, line, column);
      return;
    }

    throw RuntimeError.undefinedVariable(name, line, column);
  }

  /**
   * Check if a variable exists in this scope or any parent scope
   */
  has(name: string): boolean {
    if (this.values.has(name)) {
      return true;
    }
    if (this.parent !== null) {
      return this.parent.has(name);
    }
    return false;
  }

  /**
   * Check if a variable is a constant
   */
  isConstant(name: string): boolean {
    const entry = this.values.get(name);
    if (entry !== undefined) {
      return entry.isConstant;
    }
    if (this.parent !== null) {
      return this.parent.isConstant(name);
    }
    return false;
  }

  /**
   * Get all variable names in this scope (not including parents)
   */
  getLocalNames(): string[] {
    return Array.from(this.values.keys());
  }

  /**
   * Get all variables in this scope with their values (for debugging/GUI)
   */
  getLocals(): Map<string, { value: VibeValue; isConstant: boolean }> {
    return new Map(this.values);
  }

  /**
   * Get all variables including parent scopes
   */
  getAllVariables(): Map<string, { value: VibeValue; isConstant: boolean; scope: number }> {
    const result = new Map<string, { value: VibeValue; isConstant: boolean; scope: number }>();
    let scope = 0;
    let env: Environment | null = this;

    while (env !== null) {
      for (const [name, entry] of env.values) {
        if (!result.has(name)) {
          result.set(name, { ...entry, scope });
        }
      }
      env = env.parent;
      scope++;
    }

    return result;
  }

  /**
   * Create a child environment with this as parent
   */
  createChild(): Environment {
    return new Environment(this);
  }
}

/**
 * GlobalEnvironment - Singleton for global scope
 * Pre-populated with built-in functions
 */
export class GlobalEnvironment extends Environment {
  private static instance: GlobalEnvironment | null = null;

  private constructor() {
    super(null);
    this.initializeBuiltIns();
  }

  static getInstance(): GlobalEnvironment {
    if (!GlobalEnvironment.instance) {
      GlobalEnvironment.instance = new GlobalEnvironment();
    }
    return GlobalEnvironment.instance;
  }

  static reset(): void {
    GlobalEnvironment.instance = null;
  }

  private initializeBuiltIns(): void {
    // Built-in functions will be added by the interpreter
    // This keeps the environment decoupled from specific implementations
  }
}
