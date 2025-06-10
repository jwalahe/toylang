import { Program } from './ast.js';
import { GenzRuntimeError } from './interpreter.js';
export declare class GenzSyntaxError extends Error {
    line?: number;
    col?: number;
    constructor(message: string, line?: number, col?: number);
}
export declare class GenzLang {
    private interpreter;
    private parser?;
    constructor();
    /**
     * Parse source code into an AST
     */
    parse(source: string): Program;
    /**
     * Execute the source code and return the output
     */
    execute(source: string): string[];
}
export { GenzRuntimeError };
export type { Program } from './ast.js';
export * from './ast.js';
export { default as lexer, Token, TokenType } from './lexer.js';
