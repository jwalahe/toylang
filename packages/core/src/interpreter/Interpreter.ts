import type { ExpressionVisitor, StatementVisitor } from '../ast/Visitor.js';
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
import { TokenType } from '../tokens/TokenType.js';
import {
  Environment,
  type VibeValue,
  VibeFunction,
  VibeArray,
  isCallable,
  isArray,
  isTruthy,
  isEqual,
  stringify,
  getTypeName,
  registerBuiltIns,
} from '../runtime/index.js';
import {
  RuntimeError,
  BreakSignal,
  ContinueSignal,
  ReturnSignal,
} from '../errors/Errors.js';

/**
 * InputProvider - Interface for handling user input
 * Allows different implementations (console, GUI, mock)
 */
export interface InputProvider {
  prompt(message: string): string | null;
}

/**
 * OutputHandler - Interface for handling program output
 * Allows different implementations (console, GUI)
 */
export interface OutputHandler {
  print(message: string): void;
}

/**
 * Default console-based I/O
 */
export class ConsoleIO implements InputProvider, OutputHandler {
  private inputBuffer: string[] = [];

  setInput(inputs: string[]): void {
    this.inputBuffer = [...inputs];
  }

  prompt(_message: string): string | null {
    return this.inputBuffer.shift() ?? null;
  }

  print(message: string): void {
    console.log(message);
  }
}

/**
 * Interpreter - Tree-walking interpreter for VibeScript
 *
 * Implements the Visitor pattern to traverse and execute the AST.
 * Each visit method handles one type of AST node.
 */
export class Interpreter implements ExpressionVisitor<VibeValue>, StatementVisitor<void> {
  private environment: Environment;
  private readonly globals: Environment;
  private output: string[] = [];
  private inputProvider: InputProvider;
  private outputHandler: OutputHandler;

  // Infinite loop protection
  private opCount = 0;
  private readonly MAX_OPS = 100000;
  private startTime = Date.now();

  constructor(
    inputProvider?: InputProvider,
    outputHandler?: OutputHandler
  ) {
    const io = new ConsoleIO();
    this.inputProvider = inputProvider ?? io;
    this.outputHandler = outputHandler ?? io;

    this.globals = new Environment();
    registerBuiltIns(this.globals);
    this.environment = this.globals;
  }

  /**
   * Interpret a program
   */
  interpret(program: Program): string[] {
    this.output = [];
    this.opCount = 0;
    this.startTime = Date.now();

    try {
      for (const statement of program.statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        this.output.push(`Error: ${error.message}`);
      } else if (error instanceof Error) {
        this.output.push(`Error: ${error.message}`);
      }
    }

    return this.output;
  }

  /**
   * Execute a statement
   */
  private execute(stmt: Statement): void {
    this.checkOperationLimit();
    stmt.accept(this);
  }

  /**
   * Evaluate an expression
   */
  private evaluate(expr: Expression): VibeValue {
    this.checkOperationLimit();
    return expr.accept(this);
  }

  /**
   * Check operation limit to prevent infinite loops
   */
  private checkOperationLimit(): void {
    this.opCount++;
    if (this.opCount > this.MAX_OPS) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      if (elapsed < 2) {
        throw RuntimeError.infiniteLoop();
      }
      this.opCount = 0;
      this.startTime = Date.now();
    }
  }

  // ==================== EXPRESSION VISITORS ====================

  visitLiteralExpr(expr: LiteralExpr): VibeValue {
    return expr.value;
  }

  visitIdentifierExpr(expr: IdentifierExpr): VibeValue {
    return this.environment.get(expr.name, expr.location?.line, expr.location?.column);
  }

  visitBinaryExpr(expr: BinaryExpr): VibeValue {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    const op = expr.operator.type;

    switch (op) {
      // Arithmetic
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return left + right;
        }
        if (typeof left === 'string' || typeof right === 'string') {
          return stringify(left) + stringify(right);
        }
        throw new RuntimeError(
          `Cannot add ${getTypeName(left)} and ${getTypeName(right)}`,
          expr.operator.line,
          expr.operator.column
        );

      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) - (right as number);

      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) * (right as number);

      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        if (right === 0) {
          throw RuntimeError.divisionByZero(expr.operator.line, expr.operator.column);
        }
        return (left as number) / (right as number);

      case TokenType.PERCENT:
        this.checkNumberOperands(expr.operator, left, right);
        if (right === 0) {
          throw RuntimeError.divisionByZero(expr.operator.line, expr.operator.column);
        }
        return (left as number) % (right as number);

      // Comparison
      case TokenType.EQUAL_EQUAL:
        return isEqual(left, right);

      case TokenType.BANG_EQUAL:
        return !isEqual(left, right);

      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) < (right as number);

      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) <= (right as number);

      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) > (right as number);

      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) >= (right as number);

      default:
        throw new RuntimeError(
          `Unknown operator: ${expr.operator.lexeme}`,
          expr.operator.line,
          expr.operator.column
        );
    }
  }

  visitUnaryExpr(expr: UnaryExpr): VibeValue {
    const operand = this.evaluate(expr.operand);
    const op = expr.operator.type;

    switch (op) {
      case TokenType.MINUS:
        if (typeof operand !== 'number') {
          throw new RuntimeError(
            `Cannot negate ${getTypeName(operand)}`,
            expr.operator.line,
            expr.operator.column
          );
        }
        return -operand;

      case TokenType.NOT:
        return !isTruthy(operand);

      default:
        throw new RuntimeError(
          `Unknown unary operator: ${expr.operator.lexeme}`,
          expr.operator.line,
          expr.operator.column
        );
    }
  }

  visitLogicalExpr(expr: LogicalExpr): VibeValue {
    const left = this.evaluate(expr.left);

    // Short-circuit evaluation
    if (expr.operator.type === TokenType.OR) {
      if (isTruthy(left)) return left;
    } else {
      if (!isTruthy(left)) return left;
    }

    return this.evaluate(expr.right);
  }

  visitGroupingExpr(expr: GroupingExpr): VibeValue {
    return this.evaluate(expr.expression);
  }

  visitCallExpr(expr: CallExpr): VibeValue {
    const callee = this.evaluate(expr.callee);

    if (!isCallable(callee)) {
      throw RuntimeError.notCallable(
        getTypeName(callee),
        expr.paren.line,
        expr.paren.column
      );
    }

    const args: VibeValue[] = expr.args.map(arg => this.evaluate(arg));

    if (args.length !== callee.arity) {
      throw RuntimeError.wrongArity(
        callee.arity,
        args.length,
        expr.paren.line,
        expr.paren.column
      );
    }

    // Handle user-defined functions (skills)
    if (callee instanceof VibeFunction) {
      return this.executeFunction(callee, args);
    }

    // Handle native functions
    return callee.call(this, args);
  }

  private executeFunction(func: VibeFunction, args: VibeValue[]): VibeValue {
    const environment = new Environment(func.closure);

    // Bind parameters to arguments
    for (let i = 0; i < func.declaration.params.length; i++) {
      environment.define(func.declaration.params[i].lexeme, args[i]);
    }

    try {
      this.executeBlock(func.declaration.body.statements, environment);
    } catch (error) {
      if (error instanceof ReturnSignal) {
        return error.value as VibeValue;
      }
      throw error;
    }

    return null;
  }

  visitArrayExpr(expr: ArrayExpr): VibeValue {
    const elements = expr.elements.map(e => this.evaluate(e));
    return new VibeArray(elements);
  }

  visitIndexExpr(expr: IndexExpr): VibeValue {
    const object = this.evaluate(expr.object);
    const index = this.evaluate(expr.index);

    if (isArray(object)) {
      if (typeof index !== 'number') {
        throw new RuntimeError(
          `Array index must be a number, got ${getTypeName(index)}`,
          expr.bracket.line,
          expr.bracket.column
        );
      }
      return object.get(Math.floor(index));
    }

    if (typeof object === 'string') {
      if (typeof index !== 'number') {
        throw new RuntimeError(
          `String index must be a number, got ${getTypeName(index)}`,
          expr.bracket.line,
          expr.bracket.column
        );
      }
      const i = Math.floor(index);
      if (i < 0 || i >= object.length) return null;
      return object[i];
    }

    throw new RuntimeError(
      `Cannot index ${getTypeName(object)}`,
      expr.bracket.line,
      expr.bracket.column
    );
  }

  visitAssignExpr(expr: AssignExpr): VibeValue {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value, expr.location?.line, expr.location?.column);
    return value;
  }

  visitAskExpr(expr: AskExpr): VibeValue {
    const prompt = this.evaluate(expr.prompt);
    const input = this.inputProvider.prompt(stringify(prompt));
    return input ?? '';
  }

  // ==================== STATEMENT VISITORS ====================

  visitExpressionStmt(stmt: ExpressionStmt): void {
    this.evaluate(stmt.expression);
  }

  visitSayStmt(stmt: SayStmt): void {
    const value = this.evaluate(stmt.expression);
    const message = stringify(value);
    this.output.push(message);
    this.outputHandler.print(message);
  }

  visitHoldStmt(stmt: HoldStmt): void {
    const value = this.evaluate(stmt.initializer);
    this.environment.define(stmt.name, value, false);
  }

  visitLockStmt(stmt: LockStmt): void {
    const value = this.evaluate(stmt.initializer);
    this.environment.define(stmt.name, value, true);
  }

  visitBlockStmt(stmt: BlockStmt): void {
    this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  private executeBlock(statements: Statement[], environment: Environment): void {
    const previous = this.environment;
    this.environment = environment;

    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  visitIfStmt(stmt: IfStmt): void {
    if (isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
  }

  visitKeepStmt(stmt: KeepStmt): void {
    while (isTruthy(this.evaluate(stmt.condition))) {
      try {
        this.execute(stmt.body);
      } catch (error) {
        if (error instanceof BreakSignal) {
          break;
        }
        if (error instanceof ContinueSignal) {
          continue;
        }
        throw error;
      }
    }
  }

  visitEachStmt(stmt: EachStmt): void {
    if (stmt.isRangeLoop) {
      // Range loop: each (i from start to end)
      const startVal = this.evaluate(stmt.start!);
      const endVal = this.evaluate(stmt.end!);

      if (typeof startVal !== 'number' || typeof endVal !== 'number') {
        throw new RuntimeError(
          'Range bounds must be numbers',
          stmt.location?.line,
          stmt.location?.column
        );
      }

      const loopEnv = new Environment(this.environment);
      const varName = stmt.variable.lexeme;

      for (let i = startVal; i <= endVal; i++) {
        loopEnv.define(varName, i);

        try {
          this.executeBlock([stmt.body], loopEnv);
        } catch (error) {
          if (error instanceof BreakSignal) {
            break;
          }
          if (error instanceof ContinueSignal) {
            continue;
          }
          throw error;
        }
      }
    } else {
      // Collection loop: each (item in collection)
      const iterable = this.evaluate(stmt.iterable!);

      if (!isArray(iterable) && typeof iterable !== 'string') {
        throw new RuntimeError(
          `Cannot iterate over ${getTypeName(iterable)}`,
          stmt.location?.line,
          stmt.location?.column
        );
      }

      const loopEnv = new Environment(this.environment);
      const varName = stmt.variable.lexeme;
      const items = isArray(iterable) ? iterable.elements : [...iterable];

      for (const item of items) {
        loopEnv.define(varName, item as VibeValue);

        try {
          this.executeBlock([stmt.body], loopEnv);
        } catch (error) {
          if (error instanceof BreakSignal) {
            break;
          }
          if (error instanceof ContinueSignal) {
            continue;
          }
          throw error;
        }
      }
    }
  }

  visitSkillStmt(stmt: SkillStmt): void {
    const func = new VibeFunction(stmt, this.environment);
    this.environment.define(stmt.name, func);
  }

  visitGiveStmt(stmt: GiveStmt): void {
    let value: VibeValue = null;
    if (stmt.value !== null) {
      value = this.evaluate(stmt.value);
    }
    throw new ReturnSignal(value);
  }

  visitStopStmt(_stmt: StopStmt): void {
    throw new BreakSignal();
  }

  visitSkipStmt(_stmt: SkipStmt): void {
    throw new ContinueSignal();
  }

  visitTryStmt(stmt: TryStmt): void {
    try {
      this.executeBlock(stmt.tryBlock.statements, new Environment(this.environment));
    } catch (error) {
      // Don't catch control flow signals
      if (error instanceof BreakSignal ||
          error instanceof ContinueSignal ||
          error instanceof ReturnSignal) {
        throw error;
      }

      const catchEnv = new Environment(this.environment);

      if (stmt.errorVar) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        catchEnv.define(stmt.errorVar.lexeme, errorMessage);
      }

      this.executeBlock(stmt.catchBlock.statements, catchEnv);
    }
  }

  // ==================== HELPER METHODS ====================

  private checkNumberOperands(operator: { line: number; column: number; lexeme: string }, left: VibeValue, right: VibeValue): void {
    if (typeof left === 'number' && typeof right === 'number') return;
    throw new RuntimeError(
      `Operands of '${operator.lexeme}' must be numbers`,
      operator.line,
      operator.column
    );
  }

  /**
   * Get the current output
   */
  getOutput(): string[] {
    return [...this.output];
  }

  /**
   * Get the current environment (for debugging/GUI)
   */
  getEnvironment(): Environment {
    return this.environment;
  }

  /**
   * Get global environment
   */
  getGlobals(): Environment {
    return this.globals;
  }
}
