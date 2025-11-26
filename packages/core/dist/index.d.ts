/**
 * VibeScript - A programming language for learning
 *
 * Main entry point for the VibeScript core library.
 * Provides a simple API for parsing and executing VibeScript code.
 */
import { Interpreter, type InputProvider, type OutputHandler } from './interpreter/index.js';
import type { Program } from './ast/index.js';
import { ParseError, RuntimeError } from './errors/index.js';
/**
 * VibeScript - Main class for executing VibeScript code
 *
 * Usage:
 *   const vs = new VibeScript();
 *   const output = vs.execute('say "Hello World"');
 */
export declare class VibeScript {
    private interpreter;
    constructor(inputProvider?: InputProvider, outputHandler?: OutputHandler);
    /**
     * Tokenize source code
     */
    tokenize(source: string): import("./tokens/Token.js").Token[];
    /**
     * Parse source code into an AST
     */
    parse(source: string): Program;
    /**
     * Execute source code and return output
     */
    execute(source: string): string[];
    /**
     * Get the interpreter (for advanced usage)
     */
    getInterpreter(): Interpreter;
}
export { VibeScript as GenzLang };
export { Lexer } from './lexer/index.js';
export { Parser } from './parser/index.js';
export { Interpreter, ConsoleIO } from './interpreter/index.js';
export type { InputProvider, OutputHandler } from './interpreter/index.js';
export { Token } from './tokens/index.js';
export { TokenType, KEYWORDS } from './tokens/index.js';
export * from './ast/index.js';
export { Environment, type VibeValue, type VibeCallable, VibeFunction, VibeNativeFunction, VibeArray, stringify, getTypeName, isTruthy, isEqual, isCallable, isArray, } from './runtime/index.js';
export { VibeScriptError, LexerError, ParseError, RuntimeError, BreakSignal, ContinueSignal, ReturnSignal, } from './errors/index.js';
export { RuntimeError as GenzRuntimeError };
export { ParseError as GenzSyntaxError };
