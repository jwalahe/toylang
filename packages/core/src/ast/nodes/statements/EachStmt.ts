import { Statement, Expression, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';

/**
 * EachStmt - For loop (range-based or collection-based)
 *
 * Examples:
 *   each (i from 1 to 10) { say i; }      -> Range loop
 *   each (item in array) { say item; }    -> Collection loop
 */
export class EachStmt extends Statement {
  constructor(
    public readonly variable: Token,
    public readonly iterable: Expression | null,  // For 'in' loops
    public readonly start: Expression | null,      // For 'from...to' loops
    public readonly end: Expression | null,        // For 'from...to' loops
    public readonly body: Statement,
    location?: SourceLocation
  ) {
    super(location);
  }

  get nodeType(): string {
    return 'EachStmt';
  }

  /**
   * Check if this is a range loop (from...to) vs collection loop (in)
   */
  get isRangeLoop(): boolean {
    return this.start !== null && this.end !== null;
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitEachStmt(this);
  }
}
