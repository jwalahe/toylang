import { TokenType } from './TokenType.js';

/**
 * Token - Represents a single token in the source code
 *
 * Immutable class (all properties readonly) for safety
 * Contains position information for error reporting
 */
export class Token {
  constructor(
    public readonly type: TokenType,
    public readonly lexeme: string,
    public readonly literal: string | number | boolean | null,
    public readonly line: number,
    public readonly column: number
  ) {}

  /**
   * Factory method for creating tokens without literal values
   */
  static simple(type: TokenType, lexeme: string, line: number, column: number): Token {
    return new Token(type, lexeme, null, line, column);
  }

  /**
   * Factory method for creating EOF token
   */
  static eof(line: number, column: number): Token {
    return new Token(TokenType.EOF, '', null, line, column);
  }

  /**
   * String representation for debugging
   */
  toString(): string {
    return `Token(${this.type}, "${this.lexeme}", ${this.literal}, line: ${this.line}, col: ${this.column})`;
  }

  /**
   * Check if this token is of a specific type
   */
  is(type: TokenType): boolean {
    return this.type === type;
  }

  /**
   * Check if this token is one of several types
   */
  isOneOf(...types: TokenType[]): boolean {
    return types.includes(this.type);
  }
}
