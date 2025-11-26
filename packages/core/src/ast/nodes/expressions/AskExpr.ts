import { Expression, type SourceLocation } from '../Node.js';
import type { ExpressionVisitor } from '../../Visitor.js';

/**
 * AskExpr - Represents user input prompt
 *
 * Examples:
 *   ask "What's your name?"  -> AskExpr("What's your name?")
 */
export class AskExpr extends Expression {
  constructor(
    public readonly prompt: Expression,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'AskExpr';
  }

  accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitAskExpr(this);
  }
}
