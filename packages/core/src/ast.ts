// src/ast.ts
export type NodeType =
  | 'Program'
  | 'PrintStatement'
  | 'VarDeclaration'
  | 'IfStatement'
  | 'LoopStatement'
  | 'FunctionDeclaration'
  | 'FunctionDecl'
  | 'ReturnStatement'
  | 'BlockStatement'
  | 'ExpressionStatement'
  | 'BinaryExpression'
  | 'UnaryExpression'
  | 'Literal'
  | 'BooleanLiteral'
  | 'StringLiteral'
  | 'Identifier'
  | 'CallExpression'
  | 'ArrayExpression';

export interface Node {
  type: NodeType;
  location?: {
    line: number;
    col: number;
  };
}

export interface Program extends Node {
  type: 'Program';
  body: Statement[];
}

export type Statement =
  | PrintStatement
  | VarDeclaration
  | IfStatement
  | LoopStatement
  | BlockStatement
  | FunctionDeclaration
  | FunctionDecl
  | ReturnStatement
  | ExpressionStatement;

// Add a FunctionDecl interface to match what's in the grammar
export interface FunctionDecl extends Node {
  type: 'FunctionDecl';
  name: string;
  params: string[];
  body: Statement;
}

export interface PrintStatement extends Node {
  type: 'PrintStatement';
  expression: Expression;
}

export interface VarDeclaration extends Node {
  type: 'VarDeclaration';
  name: string;
  initializer: Expression;
}

export interface IfStatement extends Node {
  type: 'IfStatement';
  condition: Expression;
  thenBranch: Statement;
  elseBranch?: Statement;
}

export interface LoopStatement extends Node {
  type: 'LoopStatement';
  condition: Expression;
  body: Statement;
}

export interface BlockStatement extends Node {
  type: 'BlockStatement';
  statements: Statement[];
}

export interface FunctionDeclaration extends Node {
  type: 'FunctionDeclaration';
  name: string;
  params: string[];
  body: BlockStatement;
}

export interface ReturnStatement extends Node {
  type: 'ReturnStatement';
  value?: Expression;
}

export interface ExpressionStatement extends Node {
  type: 'ExpressionStatement';
  expression: Expression;
}

export type Expression =
  | BinaryExpression
  | UnaryExpression
  | Literal
  | BooleanLiteral
  | StringLiteral
  | Identifier
  | CallExpression
  | ArrayExpression;

// Add a StringLiteral interface to handle string literals
export interface StringLiteral extends Node {
  type: 'StringLiteral';
  value: string;
}

// Add a BooleanLiteral interface to handle boolean literals
export interface BooleanLiteral extends Node {
  type: 'BooleanLiteral';
  value: boolean;
}

export interface BinaryExpression extends Node {
  type: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression extends Node {
  type: 'UnaryExpression';
  operator: string;
  argument: Expression;
}

export interface Literal extends Node {
  type: 'Literal';
  value: any;
}

export interface Identifier extends Node {
  type: 'Identifier';
  name: string;
}

export interface CallExpression extends Node {
  type: 'CallExpression';
  callee: Identifier;
  arguments: Expression[];
}

export interface ArrayExpression extends Node {
  type: 'ArrayExpression';
  elements: Expression[];
}
