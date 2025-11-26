import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * IdentifierExpr - Represents variable references
 *
 * Examples:
 *   x         -> IdentifierExpr("x")
 *   myVar     -> IdentifierExpr("myVar")
 */
export class IdentifierExpr extends Expression {
  public readonly name: string;

  constructor(
    public readonly token: Token,
    location?: SourceLocation
  ) {
    super(location);
    this.name = token.lexeme;
  }

  get nodeType(): string {
    return 'IdentifierExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitIdentifierExpr(this);
  }
}
