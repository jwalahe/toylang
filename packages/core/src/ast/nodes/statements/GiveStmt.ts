import { Statement, Expression, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';

/**
 * GiveStmt - Return statement
 *
 * Examples:
 *   give x + y
 *   give "done"
 */
export class GiveStmt extends Statement {
  constructor(
    public readonly value: Expression | null,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'GiveStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitGiveStmt(this);
  }
}
