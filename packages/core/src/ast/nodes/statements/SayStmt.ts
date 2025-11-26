import { Statement, Expression, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';

/**
 * SayStmt - Print/output statement
 *
 * Examples:
 *   say "Hello World"  -> SayStmt("Hello World")
 *   say x + y          -> SayStmt(BinaryExpr(...))
 */
export class SayStmt extends Statement {
  constructor(
    public readonly expression: Expression,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'SayStmt';
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitSayStmt(this);
  }
}
