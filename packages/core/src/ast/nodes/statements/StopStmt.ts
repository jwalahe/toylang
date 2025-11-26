import { Statement, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';

/**
 * StopStmt - Break statement (exit loop)
 *
 * Examples:
 *   stop
 */
export class StopStmt extends Statement {
  constructor(location?: SourceLocation) {
    super(location);
  }

  get nodeType(): string {
    return 'StopStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitStopStmt(this);
  }
}
