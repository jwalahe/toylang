import { Statement, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';

/**
 * BlockStmt - Block of statements (creates new scope)
 *
 * Examples:
 *   { hold x = 1; say x; }
 */
export class BlockStmt extends Statement {
  constructor(
    public readonly statements: Statement[],
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'BlockStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitBlockStmt(this);
  }
}
