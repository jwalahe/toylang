import { Statement, Expression, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';

/**
 * IfStmt - Conditional statement
 *
 * Examples:
 *   if (x > 0) { say "positive"; }
 *   if (x > 0) { say "positive"; } else { say "not positive"; }
 */
export class IfStmt extends Statement {
  constructor(
    public readonly condition: Expression,
    public readonly thenBranch: Statement,
    public readonly elseBranch: Statement | null,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'IfStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitIfStmt(this);
  }
}
