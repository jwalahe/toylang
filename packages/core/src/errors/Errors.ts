import type { Token } from '../tokens/Token.js';

/**
 * Base error class for all VibeScript errors
 * Contains location information for better error messages
 */
export abstract class VibeScriptError extends Error {
  constructor(
    message: string,
    public readonly line?: number,
    public readonly column?: number
  ) {
    super(message);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where error was thrown (V8 engines)
    const ErrorConstructor = Error as ErrorConstructor & {
      captureStackTrace?: (target: object, constructor: Function) => void;
    };
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Format error with location info
   */
  format(): string {
    const location = this.line !== undefined
      ? ` [Line ${this.line}${this.column !== undefined ? `, Col ${this.column}` : ''}]`
      : '';
    return `${this.name}${location}: ${this.message}`;
  }
}

/**
 * LexerError - Thrown when the lexer encounters invalid input
 */
export class LexerError extends VibeScriptError {
  constructor(message: string, line?: number, column?: number) {
    super(message, line, column);
  }

  static unexpectedCharacter(char: string, line: number, column: number): LexerError {
    return new LexerError(`Unexpected character '${char}'`, line, column);
  }

  static unterminatedString(line: number, column: number): LexerError {
    return new LexerError('Unterminated string - missing closing quote', line, column);
  }
}

/**
 * ParseError - Thrown when the parser encounters invalid syntax
 */
export class ParseError extends VibeScriptError {
  constructor(
    message: string,
    public readonly token?: Token
  ) {
    super(message, token?.line, token?.column);
  }

  static unexpectedToken(token: Token, expected?: string): ParseError {
    const expectedMsg = expected ? `, expected ${expected}` : '';
    return new ParseError(
      `Unexpected token '${token.lexeme}'${expectedMsg}`,
      token
    );
  }

  static missingToken(expected: string, after: Token): ParseError {
    return new ParseError(
      `Missing ${expected} after '${after.lexeme}'`,
      after
    );
  }

  static invalidAssignmentTarget(token: Token): ParseError {
    return new ParseError('Invalid assignment target', token);
  }
}

/**
 * RuntimeError - Thrown during program execution
 */
export class RuntimeError extends VibeScriptError {
  constructor(message: string, line?: number, column?: number) {
    super(message, line, column);
  }

  static undefinedVariable(name: string, line?: number, column?: number): RuntimeError {
    return new RuntimeError(`Undefined variable '${name}'`, line, column);
  }

  static typeMismatch(expected: string, got: string, line?: number, column?: number): RuntimeError {
    return new RuntimeError(`Type mismatch: expected ${expected}, got ${got}`, line, column);
  }

  static divisionByZero(line?: number, column?: number): RuntimeError {
    return new RuntimeError('Division by zero', line, column);
  }

  static notCallable(type: string, line?: number, column?: number): RuntimeError {
    return new RuntimeError(`Cannot call ${type} - only skills (functions) are callable`, line, column);
  }

  static wrongArity(expected: number, got: number, line?: number, column?: number): RuntimeError {
    return new RuntimeError(
      `Expected ${expected} argument${expected !== 1 ? 's' : ''} but got ${got}`,
      line,
      column
    );
  }

  static constantReassignment(name: string, line?: number, column?: number): RuntimeError {
    return new RuntimeError(`Cannot reassign constant '${name}' - it's locked!`, line, column);
  }

  static infiniteLoop(line?: number, column?: number): RuntimeError {
    return new RuntimeError('Possible infinite loop detected - too many iterations', line, column);
  }
}

/**
 * BreakSignal - Control flow signal for 'stop' (break)
 * Not an error, but used for control flow
 */
export class BreakSignal extends Error {
  constructor() {
    super('break');
    this.name = 'BreakSignal';
  }
}

/**
 * ContinueSignal - Control flow signal for 'skip' (continue)
 */
export class ContinueSignal extends Error {
  constructor() {
    super('continue');
    this.name = 'ContinueSignal';
  }
}

/**
 * ReturnSignal - Control flow signal for 'give' (return)
 * Carries the return value
 */
export class ReturnSignal extends Error {
  constructor(public readonly value: unknown) {
    super('return');
    this.name = 'ReturnSignal';
  }
}
