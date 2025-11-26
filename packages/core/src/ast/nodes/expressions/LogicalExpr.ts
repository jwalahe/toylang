import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * LogicalExpr - Represents logical operations (and, or)
 * Separate from BinaryExpr because of short-circuit evaluation
 *
 * Examples:
 *   a and b   -> LogicalExpr(a, 'and', b)
 *   x or y    -> LogicalExpr(x, 'or', y)
 */
export class LogicalExpr extends Expression {
  constructor(
    public readonly left: Expression,
    public readonly operator: Token,
    public readonly right: Expression,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'LogicalExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitLogicalExpr(this);
  }
}
