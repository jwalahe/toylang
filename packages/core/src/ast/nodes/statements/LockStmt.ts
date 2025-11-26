import { Statement, Expression, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * LockStmt - Constant declaration (immutable)
 *
 * Examples:
 *   lock PI = 3.14   -> LockStmt("PI", 3.14)
 *   lock MAX = 100   -> LockStmt("MAX", 100)
 */
export class LockStmt extends Statement {
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
    return 'LockStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitLockStmt(this);
  }
}
