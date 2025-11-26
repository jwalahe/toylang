import { Statement, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';
import type { BlockStmt } from './BlockStmt.js';

/**
 * TryStmt - Try/Catch statement for error handling
 *
 * Examples:
 *   try { risky(); } caught (e) { say e; }
 */
export class TryStmt extends Statement {
  constructor(
    public readonly tryBlock: BlockStmt,
    public readonly errorVar: Token | null,
    public readonly catchBlock: BlockStmt,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'TryStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitTryStmt(this);
  }
}
