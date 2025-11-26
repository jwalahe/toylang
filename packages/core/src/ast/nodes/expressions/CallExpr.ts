import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * CallExpr - Represents function calls
 *
 * Examples:
 *   greet("hello")    -> CallExpr(greet, ["hello"])
 *   add(1, 2)         -> CallExpr(add, [1, 2])
 */
export class CallExpr extends Expression {
  constructor(
    public readonly callee: Expression,
    public readonly paren: Token,  // For error location
    public readonly args: Expression[],
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'CallExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitCallExpr(this);
  }
}
