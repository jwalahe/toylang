import { Token } from '../tokens/Token.js';
import { TokenType } from '../tokens/TokenType.js';
import { ParseError } from '../errors/Errors.js';
import {
  Program,
  Expression,
  Statement,
  LiteralExpr,
  IdentifierExpr,
  BinaryExpr,
  UnaryExpr,
  LogicalExpr,
  GroupingExpr,
  CallExpr,
  ArrayExpr,
  IndexExpr,
  AssignExpr,
  AskExpr,
  ExpressionStmt,
  SayStmt,
  HoldStmt,
  LockStmt,
  BlockStmt,
  IfStmt,
  KeepStmt,
  EachStmt,
  SkillStmt,
  GiveStmt,
  StopStmt,
  SkipStmt,
  TryStmt,
} from '../ast/index.js';

/**
 * Parser - Recursive Descent Parser for VibeScript
 *
 * Converts tokens into an Abstract Syntax Tree (AST).
 * Uses recursive descent parsing with operator precedence.
 *
 * Grammar (simplified):
 *   program     → statement* EOF
 *   statement   → declaration | ifStmt | keepStmt | eachStmt | ...
 *   declaration → holdStmt | lockStmt | skillStmt
 *   expression  → assignment
 *   assignment  → IDENTIFIER "=" assignment | logic_or
 *   logic_or    → logic_and ("or" logic_and)*
 *   logic_and   → equality ("and" equality)*
 *   equality    → comparison (("==" | "!=") comparison)*
 *   comparison  → term (("<" | ">" | "<=" | ">=") term)*
 *   term        → factor (("+" | "-") factor)*
 *   factor      → unary (("*" | "/" | "%") unary)*
 *   unary       → ("not" | "-") unary | call
 *   call        → primary ("(" arguments? ")" | "[" expression "]")*
 *   primary     → NUMBER | STRING | "bet" | "cap" | IDENTIFIER | "(" expression ")" | array
 */
export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * Parse all tokens into a Program AST
   */
  parse(): Program {
    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      const stmt = this.declaration();
      if (stmt) {
        statements.push(stmt);
      }
    }

    return new Program(statements);
  }

  // ==================== DECLARATIONS ====================

  private declaration(): Statement | null {
    try {
      if (this.match(TokenType.HOLD)) return this.holdStatement();
      if (this.match(TokenType.LOCK)) return this.lockStatement();
      if (this.match(TokenType.SKILL)) return this.skillStatement();

      return this.statement();
    } catch (error) {
      if (error instanceof ParseError) {
        this.synchronize();
        return null;
      }
      throw error;
    }
  }

  private holdStatement(): HoldStmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expected variable name after 'hold'");
    this.consume(TokenType.EQUAL, "Expected '=' after variable name");
    const initializer = this.expression();
    this.consumeSemicolon();

    return new HoldStmt(name, initializer, { line: name.line, column: name.column });
  }

  private lockStatement(): LockStmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expected constant name after 'lock'");
    this.consume(TokenType.EQUAL, "Expected '=' after constant name");
    const initializer = this.expression();
    this.consumeSemicolon();

    return new LockStmt(name, initializer, { line: name.line, column: name.column });
  }

  private skillStatement(): SkillStmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expected skill name");
    this.consume(TokenType.LEFT_PAREN, "Expected '(' after skill name");

    const params: Token[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (params.length >= 255) {
          throw new ParseError("Can't have more than 255 parameters", this.peek());
        }
        params.push(this.consume(TokenType.IDENTIFIER, "Expected parameter name"));
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
    this.consume(TokenType.LEFT_BRACE, "Expected '{' before skill body");

    const body = this.blockStatement();

    return new SkillStmt(name, params, body, { line: name.line, column: name.column });
  }

  // ==================== STATEMENTS ====================

  private statement(): Statement {
    if (this.match(TokenType.SAY)) return this.sayStatement();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.KEEP)) return this.keepStatement();
    if (this.match(TokenType.EACH)) return this.eachStatement();
    if (this.match(TokenType.GIVE)) return this.giveStatement();
    if (this.match(TokenType.STOP)) return this.stopStatement();
    if (this.match(TokenType.SKIP)) return this.skipStatement();
    if (this.match(TokenType.TRY)) return this.tryStatement();
    if (this.match(TokenType.LEFT_BRACE)) return this.blockStatement();

    return this.expressionStatement();
  }

  private sayStatement(): SayStmt {
    const keyword = this.previous();
    const expr = this.expression();
    this.consumeSemicolon();

    return new SayStmt(expr, { line: keyword.line, column: keyword.column });
  }

  private ifStatement(): IfStmt {
    const keyword = this.previous();
    this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'if'");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after if condition");

    const thenBranch = this.statement();
    let elseBranch: Statement | null = null;

    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new IfStmt(condition, thenBranch, elseBranch, {
      line: keyword.line,
      column: keyword.column,
    });
  }

  private keepStatement(): KeepStmt {
    const keyword = this.previous();
    this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'keep'");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after keep condition");

    const body = this.statement();

    return new KeepStmt(condition, body, { line: keyword.line, column: keyword.column });
  }

  private eachStatement(): EachStmt {
    const keyword = this.previous();
    this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'each'");

    const variable = this.consume(TokenType.IDENTIFIER, "Expected variable name");

    // Check for range loop (from...to) or collection loop (in)
    if (this.match(TokenType.FROM)) {
      // Range loop: each (i from 1 to 10)
      const start = this.expression();
      this.consume(TokenType.TO, "Expected 'to' after start value");
      const end = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after range");
      const body = this.statement();

      return new EachStmt(variable, null, start, end, body, {
        line: keyword.line,
        column: keyword.column,
      });
    } else if (this.match(TokenType.IN)) {
      // Collection loop: each (item in array)
      const iterable = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after iterable");
      const body = this.statement();

      return new EachStmt(variable, iterable, null, null, body, {
        line: keyword.line,
        column: keyword.column,
      });
    } else {
      throw new ParseError("Expected 'from' or 'in' in each statement", this.peek());
    }
  }

  private giveStatement(): GiveStmt {
    const keyword = this.previous();
    let value: Expression | null = null;

    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }

    this.consumeSemicolon();

    return new GiveStmt(value, { line: keyword.line, column: keyword.column });
  }

  private stopStatement(): StopStmt {
    const keyword = this.previous();
    this.consumeSemicolon();
    return new StopStmt({ line: keyword.line, column: keyword.column });
  }

  private skipStatement(): SkipStmt {
    const keyword = this.previous();
    this.consumeSemicolon();
    return new SkipStmt({ line: keyword.line, column: keyword.column });
  }

  private tryStatement(): TryStmt {
    const keyword = this.previous();
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after 'try'");
    const tryBlock = this.blockStatement();

    this.consume(TokenType.CAUGHT, "Expected 'caught' after try block");

    let errorVar: Token | null = null;
    if (this.match(TokenType.LEFT_PAREN)) {
      errorVar = this.consume(TokenType.IDENTIFIER, "Expected error variable name");
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after error variable");
    }

    this.consume(TokenType.LEFT_BRACE, "Expected '{' after 'caught'");
    const catchBlock = this.blockStatement();

    return new TryStmt(tryBlock, errorVar, catchBlock, {
      line: keyword.line,
      column: keyword.column,
    });
  }

  private blockStatement(): BlockStmt {
    const brace = this.previous();
    const statements: Statement[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.declaration();
      if (stmt) {
        statements.push(stmt);
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after block");

    return new BlockStmt(statements, { line: brace.line, column: brace.column });
  }

  private expressionStatement(): ExpressionStmt {
    const expr = this.expression();
    this.consumeSemicolon();
    return new ExpressionStmt(expr);
  }

  // ==================== EXPRESSIONS ====================

  private expression(): Expression {
    return this.assignment();
  }

  private assignment(): Expression {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof IdentifierExpr) {
        return new AssignExpr(expr.token, value, {
          line: equals.line,
          column: equals.column,
        });
      }

      throw ParseError.invalidAssignmentTarget(equals);
    }

    return expr;
  }

  private or(): Expression {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = new LogicalExpr(expr, operator, right);
    }

    return expr;
  }

  private and(): Expression {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = new LogicalExpr(expr, operator, right);
    }

    return expr;
  }

  private equality(): Expression {
    let expr = this.comparison();

    while (this.match(TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  private comparison(): Expression {
    let expr = this.term();

    while (this.match(TokenType.LESS, TokenType.LESS_EQUAL, TokenType.GREATER, TokenType.GREATER_EQUAL)) {
      const operator = this.previous();
      const right = this.term();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  private term(): Expression {
    let expr = this.factor();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  private factor(): Expression {
    let expr = this.unary();

    while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  private unary(): Expression {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new UnaryExpr(operator, right);
    }

    return this.call();
  }

  private call(): Expression {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.LEFT_BRACKET)) {
        expr = this.finishIndex(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  private finishCall(callee: Expression): CallExpr {
    const paren = this.previous();
    const args: Expression[] = [];

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          throw new ParseError("Can't have more than 255 arguments", this.peek());
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");

    return new CallExpr(callee, paren, args);
  }

  private finishIndex(object: Expression): IndexExpr {
    const bracket = this.previous();
    const index = this.expression();
    this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after index");

    return new IndexExpr(object, bracket, index);
  }

  private primary(): Expression {
    // Booleans
    if (this.match(TokenType.BET)) {
      return new LiteralExpr(true, {
        line: this.previous().line,
        column: this.previous().column,
      });
    }
    if (this.match(TokenType.CAP)) {
      return new LiteralExpr(false, {
        line: this.previous().line,
        column: this.previous().column,
      });
    }

    // Numbers
    if (this.match(TokenType.NUMBER)) {
      const token = this.previous();
      return new LiteralExpr(token.literal as number, {
        line: token.line,
        column: token.column,
      });
    }

    // Strings
    if (this.match(TokenType.STRING)) {
      const token = this.previous();
      return new LiteralExpr(token.literal as string, {
        line: token.line,
        column: token.column,
      });
    }

    // Ask expression (input)
    if (this.match(TokenType.ASK)) {
      const prompt = this.expression();
      return new AskExpr(prompt);
    }

    // Identifiers
    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      return new IdentifierExpr(token, {
        line: token.line,
        column: token.column,
      });
    }

    // Grouping (parentheses)
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
      return new GroupingExpr(expr);
    }

    // Array literal
    if (this.match(TokenType.LEFT_BRACKET)) {
      return this.arrayLiteral();
    }

    throw ParseError.unexpectedToken(this.peek());
  }

  private arrayLiteral(): ArrayExpr {
    const bracket = this.previous();
    const elements: Expression[] = [];

    if (!this.check(TokenType.RIGHT_BRACKET)) {
      do {
        elements.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array elements");

    return new ArrayExpr(elements, { line: bracket.line, column: bracket.column });
  }

  // ==================== HELPER METHODS ====================

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new ParseError(message, this.peek());
  }

  private consumeSemicolon(): void {
    // Semicolons are optional in some cases
    this.match(TokenType.SEMICOLON);
  }

  /**
   * Synchronize after a parse error
   * Advances to the next statement boundary
   */
  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.SKILL:
        case TokenType.HOLD:
        case TokenType.LOCK:
        case TokenType.IF:
        case TokenType.KEEP:
        case TokenType.EACH:
        case TokenType.SAY:
        case TokenType.GIVE:
        case TokenType.TRY:
          return;
      }

      this.advance();
    }
  }
}
