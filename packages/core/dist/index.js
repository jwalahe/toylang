/**
 * VibeScript - A programming language for learning
 *
 * Main entry point for the VibeScript core library.
 * Provides a simple API for parsing and executing VibeScript code.
 */
import { Lexer } from './lexer/index.js';
import { Parser } from './parser/index.js';
import { Interpreter } from './interpreter/index.js';
import { VibeScriptError, ParseError, RuntimeError } from './errors/index.js';
/**
 * VibeScript - Main class for executing VibeScript code
 *
 * Usage:
 *   const vs = new VibeScript();
 *   const output = vs.execute('say "Hello World"');
 */
export class VibeScript {
    constructor(inputProvider, outputHandler) {
        this.interpreter = new Interpreter(inputProvider, outputHandler);
    }
    /**
     * Tokenize source code
     */
    tokenize(source) {
        const lexer = new Lexer(source);
        return lexer.scanTokens();
    }
    /**
     * Parse source code into an AST
     */
    parse(source) {
        const tokens = this.tokenize(source);
        const parser = new Parser(tokens);
        return parser.parse();
    }
    /**
     * Execute source code and return output
     */
    execute(source) {
        try {
            const program = this.parse(source);
            return this.interpreter.interpret(program);
        }
        catch (error) {
            if (error instanceof VibeScriptError) {
                return [`Error: ${error.format()}`];
            }
            if (error instanceof Error) {
                return [`Error: ${error.message}`];
            }
            return [`Error: ${String(error)}`];
        }
    }
    /**
     * Get the interpreter (for advanced usage)
     */
    getInterpreter() {
        return this.interpreter;
    }
}
// Backwards compatibility alias
export { VibeScript as GenzLang };
// Re-export all public types and classes
export { Lexer } from './lexer/index.js';
export { Parser } from './parser/index.js';
export { Interpreter, ConsoleIO } from './interpreter/index.js';
// Token types
export { Token } from './tokens/index.js';
export { TokenType, KEYWORDS } from './tokens/index.js';
// AST types
export * from './ast/index.js';
// Runtime types
export { Environment, VibeFunction, VibeNativeFunction, VibeArray, stringify, getTypeName, isTruthy, isEqual, isCallable, isArray, } from './runtime/index.js';
// Error types
export { VibeScriptError, LexerError, ParseError, RuntimeError, BreakSignal, ContinueSignal, ReturnSignal, } from './errors/index.js';
// Backwards compatibility
export { RuntimeError as GenzRuntimeError };
export { ParseError as GenzSyntaxError };
//# sourceMappingURL=index.js.map