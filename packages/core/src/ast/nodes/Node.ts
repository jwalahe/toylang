import type { ExpressionVisitor, StatementVisitor } from '../Visitor.js';

/**
 * Location information for AST nodes
 * Used for error reporting and debugging
 */
export interface SourceLocation {
  line: number;
  column: number;
}

/**
 * Base class for all AST nodes
 * Abstract class that defines the common interface
 */
export abstract class ASTNode {
  constructor(public readonly location?: SourceLocation) {}

  /**
   * Get the node type name for debugging
   */
  abstract get nodeType(): string;
}

/**
 * Base class for all expression nodes
 * Expressions produce values
 */
export abstract class Expression extends ASTNode {
  /**
   * Accept a visitor (Visitor pattern)
   */
  abstract accept<R>(visitor: ExpressionVisitor<R>): R;
}

/**
 * Base class for all statement nodes
 * Statements perform actions
 */
export abstract class Statement extends ASTNode {
  /**
   * Accept a visitor (Visitor pattern)
   */
  abstract accept<R>(visitor: StatementVisitor<R>): R;
}

/**
 * Program - root node of the AST
 * Contains all top-level statements
 */
export class Program extends ASTNode {
  constructor(
    public readonly statements: Statement[],
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'Program';
  }
}
