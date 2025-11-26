/**
 * Visitor Pattern for AST traversal
 *
 * The Visitor pattern allows us to add new operations on AST nodes
 * without modifying the node classes themselves.
 *
 * Each visitor implements this interface to define what happens
 * when visiting each node type.
 */

// Forward declarations - actual types imported in nodes
import type { Expression, Statement } from './nodes/index.js';

/**
 * Expression Visitor - visits all expression node types
 * @template R - Return type of visitor methods
 */
export interface ExpressionVisitor<R> {
  visitLiteralExpr(expr: import('./nodes/expressions/LiteralExpr.js').LiteralExpr): R;
  visitIdentifierExpr(expr: import('./nodes/expressions/IdentifierExpr.js').IdentifierExpr): R;
  visitBinaryExpr(expr: import('./nodes/expressions/BinaryExpr.js').BinaryExpr): R;
  visitUnaryExpr(expr: import('./nodes/expressions/UnaryExpr.js').UnaryExpr): R;
  visitLogicalExpr(expr: import('./nodes/expressions/LogicalExpr.js').LogicalExpr): R;
  visitGroupingExpr(expr: import('./nodes/expressions/GroupingExpr.js').GroupingExpr): R;
  visitCallExpr(expr: import('./nodes/expressions/CallExpr.js').CallExpr): R;
  visitArrayExpr(expr: import('./nodes/expressions/ArrayExpr.js').ArrayExpr): R;
  visitIndexExpr(expr: import('./nodes/expressions/IndexExpr.js').IndexExpr): R;
  visitAssignExpr(expr: import('./nodes/expressions/AssignExpr.js').AssignExpr): R;
  visitAskExpr(expr: import('./nodes/expressions/AskExpr.js').AskExpr): R;
}

/**
 * Statement Visitor - visits all statement node types
 * @template R - Return type of visitor methods
 */
export interface StatementVisitor<R> {
  visitExpressionStmt(stmt: import('./nodes/statements/ExpressionStmt.js').ExpressionStmt): R;
  visitSayStmt(stmt: import('./nodes/statements/SayStmt.js').SayStmt): R;
  visitHoldStmt(stmt: import('./nodes/statements/HoldStmt.js').HoldStmt): R;
  visitLockStmt(stmt: import('./nodes/statements/LockStmt.js').LockStmt): R;
  visitBlockStmt(stmt: import('./nodes/statements/BlockStmt.js').BlockStmt): R;
  visitIfStmt(stmt: import('./nodes/statements/IfStmt.js').IfStmt): R;
  visitKeepStmt(stmt: import('./nodes/statements/KeepStmt.js').KeepStmt): R;
  visitEachStmt(stmt: import('./nodes/statements/EachStmt.js').EachStmt): R;
  visitSkillStmt(stmt: import('./nodes/statements/SkillStmt.js').SkillStmt): R;
  visitGiveStmt(stmt: import('./nodes/statements/GiveStmt.js').GiveStmt): R;
  visitStopStmt(stmt: import('./nodes/statements/StopStmt.js').StopStmt): R;
  visitSkipStmt(stmt: import('./nodes/statements/SkipStmt.js').SkipStmt): R;
  visitTryStmt(stmt: import('./nodes/statements/TryStmt.js').TryStmt): R;
}

/**
 * Full AST Visitor - combines both expression and statement visitors
 */
export interface ASTVisitor<R> extends ExpressionVisitor<R>, StatementVisitor<R> {}
