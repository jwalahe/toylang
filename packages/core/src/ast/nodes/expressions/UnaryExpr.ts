import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * UnaryExpr - Represents unary operations
 *
 * Examples:
 *   -x        -> UnaryExpr('-', x)
 *   not flag  -> UnaryExpr('not', flag)
 */
export class UnaryExpr extends Expression {
  constructor(
    public readonly operator: Token,
    public readonly operand: Expression,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'UnaryExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }
}
