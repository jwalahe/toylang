import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';

/**
 * ArrayExpr - Represents array literals
 *
 * Examples:
 *   [1, 2, 3]         -> ArrayExpr([1, 2, 3])
 *   ["a", "b"]        -> ArrayExpr(["a", "b"])
 */
export class ArrayExpr extends Expression {
  constructor(
    public readonly elements: Expression[],
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'ArrayExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitArrayExpr(this);
  }
}
