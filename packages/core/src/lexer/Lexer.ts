import { Token } from '../tokens/Token.js';
import { TokenType, KEYWORDS } from '../tokens/TokenType.js';
import { LexerError } from '../errors/Errors.js';

/**
 * Lexer - Converts source code into a stream of tokens
 *
 * Hand-written lexer for full control over tokenization.
 * Single-pass, character-by-character scanning.
 *
 * Design Pattern: Iterator - provides tokens one at a time
 */
export class Lexer {
  private readonly source: string;
  private readonly tokens: Token[] = [];

  // Position tracking
  private start = 0;      // Start of current lexeme
  private current = 0;    // Current position in source
  private line = 1;       // Current line number
  private column = 1;     // Current column number
  private lineStart = 0;  // Position where current line started

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Scan all tokens from source
   * Returns array of tokens including EOF
   */
  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    // Add EOF token
    this.tokens.push(Token.eof(this.line, this.column));
    return this.tokens;
  }

  /**
   * Check if we've reached end of source
   */
  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  /**
   * Scan a single token
   */
  private scanToken(): void {
    const char = this.advance();

    switch (char) {
      // Single-character tokens
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case '[': this.addToken(TokenType.LEFT_BRACKET); break;
      case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '*': this.addToken(TokenType.STAR); break;
      case '%': this.addToken(TokenType.PERCENT); break;

      // Two-character tokens or single
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.NOT);
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;

      // Division or comment
      case '/':
        if (this.match('/')) {
          // Single-line comment - skip until end of line
          this.skipLineComment();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      // Whitespace
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break;

      case '\n':
        this.newLine();
        break;

      // String literals
      case '"':
        this.string();
        break;

      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          throw LexerError.unexpectedCharacter(char, this.line, this.getColumn());
        }
        break;
    }
  }

  /**
   * Advance and return current character
   */
  private advance(): string {
    const char = this.source.charAt(this.current);
    this.current++;
    this.column++;
    return char;
  }

  /**
   * Peek at current character without consuming
   */
  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  /**
   * Peek at next character without consuming
   */
  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  /**
   * Match expected character and advance if matched
   */
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;

    this.current++;
    this.column++;
    return true;
  }

  /**
   * Handle newline
   */
  private newLine(): void {
    this.line++;
    this.column = 1;
    this.lineStart = this.current;
  }

  /**
   * Get current column (for error reporting)
   */
  private getColumn(): number {
    return this.start - this.lineStart + 1;
  }

  /**
   * Skip single-line comment
   */
  private skipLineComment(): void {
    while (this.peek() !== '\n' && !this.isAtEnd()) {
      this.advance();
    }
  }

  /**
   * Handle 'note' style comments
   * Called when we encounter 'note' keyword
   */
  private noteComment(): void {
    // Skip the rest of the line (it's a comment)
    while (this.peek() !== '\n' && !this.isAtEnd()) {
      this.advance();
    }
  }

  /**
   * Scan string literal
   */
  private string(): void {
    const startLine = this.line;
    const startColumn = this.getColumn();

    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.newLine();
      }
      // Handle escape sequences
      if (this.peek() === '\\' && !this.isAtEnd()) {
        this.advance(); // Skip backslash
        if (!this.isAtEnd()) {
          this.advance(); // Skip escaped character
        }
      } else {
        this.advance();
      }
    }

    if (this.isAtEnd()) {
      throw LexerError.unterminatedString(startLine, startColumn);
    }

    // Consume closing quote
    this.advance();

    // Extract string value (without quotes)
    const value = this.source.substring(this.start + 1, this.current - 1);
    // Process escape sequences
    const processed = this.processEscapes(value);
    this.addTokenWithLiteral(TokenType.STRING, processed);
  }

  /**
   * Process escape sequences in string
   */
  private processEscapes(str: string): string {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }

  /**
   * Scan number literal
   */
  private number(): void {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for decimal part
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance(); // Consume '.'
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = parseFloat(this.source.substring(this.start, this.current));
    this.addTokenWithLiteral(TokenType.NUMBER, value);
  }

  /**
   * Scan identifier or keyword
   */
  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    const lowerText = text.toLowerCase();

    // Check if it's a 'note' comment
    if (lowerText === 'note') {
      this.noteComment();
      return;
    }

    // Check if it's a keyword (case-insensitive)
    const type = KEYWORDS.get(lowerText) || TokenType.IDENTIFIER;

    // For boolean literals, add with literal value
    if (type === TokenType.BET) {
      this.addTokenWithLiteral(type, true);
    } else if (type === TokenType.CAP) {
      this.addTokenWithLiteral(type, false);
    } else {
      this.addToken(type);
    }
  }

  /**
   * Check if character is a digit
   */
  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  /**
   * Check if character is alphabetic or underscore
   */
  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') ||
           (char >= 'A' && char <= 'Z') ||
           char === '_';
  }

  /**
   * Check if character is alphanumeric or underscore
   */
  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  /**
   * Add token without literal value
   */
  private addToken(type: TokenType): void {
    const lexeme = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, lexeme, null, this.line, this.getColumn()));
  }

  /**
   * Add token with literal value
   */
  private addTokenWithLiteral(type: TokenType, literal: string | number | boolean): void {
    const lexeme = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, lexeme, literal, this.line, this.getColumn()));
  }
}
