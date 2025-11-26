import { Statement, Expression, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';

/**
 * ExpressionStmt - Statement containing just an expression
 *
 * Examples:
 *   greet("hello");  -> ExpressionStmt(CallExpr(...))
 *   x + 1;           -> ExpressionStmt(BinaryExpr(...))
 */
export class ExpressionStmt extends Statement {
  constructor(
    public readonly expression: Expression,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'ExpressionStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}
