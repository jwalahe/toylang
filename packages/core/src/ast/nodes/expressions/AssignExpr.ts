import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * AssignExpr - Represents variable assignment
 *
 * Examples:
 *   x = 5     -> AssignExpr("x", 5)
 *   y = y + 1 -> AssignExpr("y", BinaryExpr(y, '+', 1))
 */
export class AssignExpr extends Expression {
  public readonly name: string;

  constructor(
    public readonly token: Token,
    public readonly value: Expression,
    location?: SourceLocation
  ) {
    super(location);
    this.name = token.lexeme;
  }

  get nodeType(): string {
    return 'AssignExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitAssignExpr(this);
  }
}
