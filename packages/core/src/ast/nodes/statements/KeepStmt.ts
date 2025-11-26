import { Statement, Expression, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';

/**
 * KeepStmt - While loop
 *
 * Examples:
 *   keep (x < 10) { x = x + 1; }
 */
export class KeepStmt extends Statement {
  constructor(
    public readonly condition: Expression,
    public readonly body: Statement,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'KeepStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitKeepStmt(this);
  }
}
