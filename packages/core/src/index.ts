// src/index.ts
import nearley from 'nearley';
import { Program } from './ast';
import lexer from './lexer';
import { Interpreter, GenzRuntimeError } from './interpreter';
import grammar from './grammar-esm-fixed';

export class GenzSyntaxError extends Error {
  line?: number;
  col?: number;

  constructor(message: string, line?: number, col?: number) {
    super(`🔥 Syntax sus detected: ${message}`);
    this.name = 'GenzSyntaxError';
    this.line = line;
    this.col = col;
  }
}

export class GenzLang {
  private interpreter: Interpreter;
  private parser?: nearley.Parser;
  
  constructor() {
    this.interpreter = new Interpreter();
  }
  
  /**
   * Parse source code into an AST
   */
  parse(source: string): Program {
    try {
      // Create a new parser instance from our grammar
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      
      // Feed the input string to the parser
      parser.feed(source);
      
      // Check for successful parse results
      if (parser.results.length === 0) {
        throw new GenzSyntaxError('No parse results, syntax error');
      }
      
      if (parser.results.length > 1) {
        console.warn(`Ambiguous grammar detected! ${parser.results.length} parse trees found.`);
      }
      
      // Return the first parse result as our AST
      return parser.results[0] as Program;
    } catch (error) {
      if (error instanceof Error) {
        // Try to extract line/col info from nearley errors
        const lineMatch = error.message.match(/at line (\d+)/);
        const colMatch = error.message.match(/at column (\d+)/);
        
        const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
        const col = colMatch ? parseInt(colMatch[1], 10) : undefined;
        
        throw new GenzSyntaxError(error.message, line, col);
      }
      throw error;
    }
  }
  
  /**
   * Execute the source code and return the output
   */
  execute(source: string): string[] {
    try {
      const ast = this.parse(source);
      return this.interpreter.interpret(ast);
    } catch (error) {
      // If the error is a simple string (likely a return value), just return it
      if (typeof error === 'string') {
        return [error];
      }
      
      // If the error is one of our defined error types, return the message
      if (error instanceof GenzSyntaxError || error instanceof GenzRuntimeError) {
        return [error.message];
      } 
      
      // For any other errors, create a diagnostic message
      if (error instanceof Error) {
        console.error('Internal Error:', error);
      }
      
      return [`${String(error)}`];
    }
  }
}

// Re-export types and error classes
export { GenzRuntimeError };
export type { Program } from './ast';
export * from './ast';
export { default as lexer, Token, TokenType } from './lexer';
