import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';

/**
 * GroupingExpr - Represents parenthesized expressions
 *
 * Examples:
 *   (a + b)   -> GroupingExpr(BinaryExpr(a, '+', b))
 */
export class GroupingExpr extends Expression {
  constructor(
    public readonly expression: Expression,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'GroupingExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}
