import { Statement, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';

/**
 * SkipStmt - Continue statement (skip to next iteration)
 *
 * Examples:
 *   skip
 */
export class SkipStmt extends Statement {
  constructor(location?: SourceLocation) {
    super(location);
  }

  get nodeType(): string {
    return 'SkipStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitSkipStmt(this);
  }
}
