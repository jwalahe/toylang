/**
 * TokenType - Enum representing all possible token types in VibeScript
 *
 * Design: Using const enum for zero runtime overhead
 * Categories: Keywords, Operators, Literals, Punctuation, Special
 */
export enum TokenType {
  // === KEYWORDS ===
  // Variable declarations
  HOLD = 'HOLD',           // Variable declaration
  LOCK = 'LOCK',           // Constant declaration

  // I/O
  SAY = 'SAY',             // Print/output
  ASK = 'ASK',             // Input

  // Control flow
  IF = 'IF',               // Conditional
  ELSE = 'ELSE',           // Alternative branch
  KEEP = 'KEEP',           // While loop
  EACH = 'EACH',           // For loop
  FROM = 'FROM',           // Range start
  TO = 'TO',               // Range end
  IN = 'IN',               // Iterator

  // Functions
  SKILL = 'SKILL',         // Function declaration
  GIVE = 'GIVE',           // Return statement

  // Loop control
  STOP = 'STOP',           // Break
  SKIP = 'SKIP',           // Continue

  // Booleans
  BET = 'BET',             // true
  CAP = 'CAP',             // false

  // Logical operators (keywords)
  AND = 'AND',             // Logical AND
  OR = 'OR',               // Logical OR
  NOT = 'NOT',             // Logical NOT

  // Error handling
  TRY = 'TRY',             // Try block
  CAUGHT = 'CAUGHT',       // Catch block

  // === OPERATORS ===
  // Arithmetic
  PLUS = 'PLUS',           // +
  MINUS = 'MINUS',         // -
  STAR = 'STAR',           // *
  SLASH = 'SLASH',         // /
  PERCENT = 'PERCENT',     // %

  // Comparison
  EQUAL_EQUAL = 'EQUAL_EQUAL',   // ==
  BANG_EQUAL = 'BANG_EQUAL',     // !=
  LESS = 'LESS',                 // <
  LESS_EQUAL = 'LESS_EQUAL',     // <=
  GREATER = 'GREATER',           // >
  GREATER_EQUAL = 'GREATER_EQUAL', // >=

  // Assignment
  EQUAL = 'EQUAL',         // =

  // === PUNCTUATION ===
  LEFT_PAREN = 'LEFT_PAREN',     // (
  RIGHT_PAREN = 'RIGHT_PAREN',   // )
  LEFT_BRACE = 'LEFT_BRACE',     // {
  RIGHT_BRACE = 'RIGHT_BRACE',   // }
  LEFT_BRACKET = 'LEFT_BRACKET', // [
  RIGHT_BRACKET = 'RIGHT_BRACKET', // ]
  COMMA = 'COMMA',               // ,
  SEMICOLON = 'SEMICOLON',       // ;

  // === LITERALS ===
  NUMBER = 'NUMBER',       // Numeric literal
  STRING = 'STRING',       // String literal
  IDENTIFIER = 'IDENTIFIER', // Variable/function names

  // === SPECIAL ===
  EOF = 'EOF',             // End of file
  NEWLINE = 'NEWLINE',     // Line break (for tracking)
}

/**
 * Keyword mapping - maps lowercase keywords to their token types
 * Using Map for O(1) lookup performance
 */
export const KEYWORDS: Map<string, TokenType> = new Map([
  ['hold', TokenType.HOLD],
  ['lock', TokenType.LOCK],
  ['say', TokenType.SAY],
  ['ask', TokenType.ASK],
  ['if', TokenType.IF],
  ['else', TokenType.ELSE],
  ['keep', TokenType.KEEP],
  ['each', TokenType.EACH],
  ['from', TokenType.FROM],
  ['to', TokenType.TO],
  ['in', TokenType.IN],
  ['skill', TokenType.SKILL],
  ['give', TokenType.GIVE],
  ['stop', TokenType.STOP],
  ['skip', TokenType.SKIP],
  ['bet', TokenType.BET],
  ['cap', TokenType.CAP],
  ['and', TokenType.AND],
  ['or', TokenType.OR],
  ['not', TokenType.NOT],
  ['try', TokenType.TRY],
  ['caught', TokenType.CAUGHT],
]);
