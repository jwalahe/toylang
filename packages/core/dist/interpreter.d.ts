import type { Program, FunctionDeclaration } from './ast.js';
export declare class GenzRuntimeError extends Error {
    line?: number;
    col?: number;
    constructor(message: string, line?: number, col?: number);
}
type GenzValue = string | number | boolean | GenzValue[] | GenzFunction | undefined;
interface GenzFunction {
    declaration: FunctionDeclaration;
    closure: Environment;
}
declare class Environment {
    values: Map<string, GenzValue>;
    enclosing: Environment | null;
    constructor(enclosing?: Environment | null);
    define(name: string, value: GenzValue): void;
    assign(name: string, value: GenzValue): void;
    get(name: string): GenzValue;
}
export declare class Interpreter {
    environment: Environment;
    output: string[];
    private opCount;
    private readonly MAX_OPS;
    private startTime;
    private inFunctionContext;
    constructor();
    interpret(program: Program): string[];
    private checkOperationLimit;
    private execute;
    private executePrint;
    private executeVarDecl;
    private executeIf;
    private executeLoop;
    private executeBlock;
    private executeFunctionBlock;
    private executeFunction;
    private executeReturn;
    private executeExprStmt;
    private evaluate;
    private evaluateLiteral;
    private evaluateBooleanLiteral;
    private evaluateIdentifier;
    private evaluateBinary;
    private evaluateUnary;
    private evaluateCall;
    private evaluateArray;
    private isTruthy;
    private isEqual;
    private isCallable;
    private checkNumberOperands;
}
export {};
