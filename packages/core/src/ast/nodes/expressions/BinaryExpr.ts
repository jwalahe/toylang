import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * BinaryExpr - Represents binary operations
 *
 * Examples:
 *   a + b     -> BinaryExpr(a, '+', b)
 *   x * y     -> BinaryExpr(x, '*', y)
 *   n == 5    -> BinaryExpr(n, '==', 5)
 */
export class BinaryExpr extends Expression {
  constructor(
    public readonly left: Expression,
    public readonly operator: Token,
    public readonly right: Expression,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'BinaryExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }
}
