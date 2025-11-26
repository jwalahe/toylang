import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * IndexExpr - Represents array/string indexing
 *
 * Examples:
 *   arr[0]    -> IndexExpr(arr, 0)
 *   str[i]    -> IndexExpr(str, i)
 */
export class IndexExpr extends Expression {
  constructor(
    public readonly object: Expression,
    public readonly bracket: Token,  // For error location
    public readonly index: Expression,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'IndexExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitIndexExpr(this);
  }
}
