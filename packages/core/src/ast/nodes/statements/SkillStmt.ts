import { Statement, type SourceLocation } from '../Node.js';
import type { StatementVisitor } from '../../Visitor.js';
import type { Token } from '../../../tokens/Token.js';
import type { BlockStmt } from './BlockStmt.js';

/**
 * SkillStmt - Function declaration
 *
 * Examples:
 *   skill greet(name) { say "Hello " + name; }
 *   skill add(a, b) { give a + b; }
 */
export class SkillStmt extends Statement {
  public readonly name: string;

  constructor(
    public readonly token: Token,
    public readonly params: Token[],
    public readonly body: BlockStmt,
    location?: SourceLocation
  ) {
    super(location);
    this.name = token.lexeme;
  }

  get nodeType(): string {
    return 'SkillStmt';
  }

  /**
   * Get parameter names as strings
   */
  get paramNames(): string[] {
    return this.params.map(p => p.lexeme);
  }

  accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitSkillStmt(this);
  }
}
