import { Statement, Expression, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * HoldStmt - Variable declaration
 *
 * Examples:
 *   hold x = 5       -> HoldStmt("x", 5)
 *   hold name = "Jo" -> HoldStmt("name", "Jo")
 */
export class HoldStmt extends Statement {
  public readonly name: string;

  constructor(
    public readonly token: Token,
    public readonly initializer: Expression,
    location?: SourceLocation
  ) {
    super(location);
    this.name = token.lexeme;
  }

  get nodeType(): string {
    return 'HoldStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitHoldStmt(this);
  }
}
