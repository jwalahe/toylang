import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';

/**
 * Literal types supported by VibeScript
 */
export type LiteralValue = string | number | boolean | null;

/**
 * LiteralExpr - Represents literal values (numbers, strings, booleans)
 *
 * Examples:
 *   42        -> LiteralExpr(42)
 *   "hello"   -> LiteralExpr("hello")
 *   bet       -> LiteralExpr(true)
 *   cap       -> LiteralExpr(false)
 */
export class LiteralExpr extends Expression {
  constructor(
    public readonly value: LiteralValue,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'LiteralExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}
