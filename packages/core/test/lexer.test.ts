// test/lexer.test.ts
import { describe, it, expect } from 'vitest';
import { Lexer, TokenType } from '../src/index.js';

describe('Lexer', () => {
  it('should tokenize keywords correctly', () => {
    const lexer = new Lexer('say hold lock if else bet cap keep each skill give stop skip try caught');
    const tokens = lexer.scanTokens();

    // Exclude EOF token
    const keywords = tokens.filter(t => t.type !== TokenType.EOF);

    expect(keywords).toHaveLength(15);
    expect(keywords[0].type).toBe(TokenType.SAY);
    expect(keywords[1].type).toBe(TokenType.HOLD);
    expect(keywords[2].type).toBe(TokenType.LOCK);
    expect(keywords[3].type).toBe(TokenType.IF);
    expect(keywords[4].type).toBe(TokenType.ELSE);
    expect(keywords[5].type).toBe(TokenType.BET);
    expect(keywords[6].type).toBe(TokenType.CAP);
    expect(keywords[7].type).toBe(TokenType.KEEP);
    expect(keywords[8].type).toBe(TokenType.EACH);
    expect(keywords[9].type).toBe(TokenType.SKILL);
    expect(keywords[10].type).toBe(TokenType.GIVE);
    expect(keywords[11].type).toBe(TokenType.STOP);
    expect(keywords[12].type).toBe(TokenType.SKIP);
    expect(keywords[13].type).toBe(TokenType.TRY);
    expect(keywords[14].type).toBe(TokenType.CAUGHT);
  });

  it('should tokenize literals and identifiers correctly', () => {
    const lexer = new Lexer('42 3.14 "hello world" variable_name');
    const tokens = lexer.scanTokens();

    // Exclude EOF token
    const meaningful = tokens.filter(t => t.type !== TokenType.EOF);

    expect(meaningful).toHaveLength(4);
    expect(meaningful[0].type).toBe(TokenType.NUMBER);
    expect(meaningful[0].literal).toBe(42);
    expect(meaningful[1].type).toBe(TokenType.NUMBER);
    expect(meaningful[1].literal).toBe(3.14);
    expect(meaningful[2].type).toBe(TokenType.STRING);
    expect(meaningful[2].literal).toBe('hello world');
    expect(meaningful[3].type).toBe(TokenType.IDENTIFIER);
    expect(meaningful[3].lexeme).toBe('variable_name');
  });

  it('should tokenize operators and punctuation correctly', () => {
    const lexer = new Lexer('( ) { } [ ] , = == > < >= <= != + - * /');
    const tokens = lexer.scanTokens();

    // Exclude EOF token
    const ops = tokens.filter(t => t.type !== TokenType.EOF);

    expect(ops).toHaveLength(18);
    expect(ops[0].type).toBe(TokenType.LEFT_PAREN);
    expect(ops[1].type).toBe(TokenType.RIGHT_PAREN);
    expect(ops[2].type).toBe(TokenType.LEFT_BRACE);
    expect(ops[3].type).toBe(TokenType.RIGHT_BRACE);
    expect(ops[4].type).toBe(TokenType.LEFT_BRACKET);
    expect(ops[5].type).toBe(TokenType.RIGHT_BRACKET);
    expect(ops[6].type).toBe(TokenType.COMMA);
    expect(ops[7].type).toBe(TokenType.EQUAL);
    expect(ops[8].type).toBe(TokenType.EQUAL_EQUAL);
    expect(ops[9].type).toBe(TokenType.GREATER);
    expect(ops[10].type).toBe(TokenType.LESS);
    expect(ops[11].type).toBe(TokenType.GREATER_EQUAL);
    expect(ops[12].type).toBe(TokenType.LESS_EQUAL);
    expect(ops[13].type).toBe(TokenType.BANG_EQUAL);
    expect(ops[14].type).toBe(TokenType.PLUS);
    expect(ops[15].type).toBe(TokenType.MINUS);
    expect(ops[16].type).toBe(TokenType.STAR);
    expect(ops[17].type).toBe(TokenType.SLASH);
  });

  it('should tokenize a hello world program correctly', () => {
    const lexer = new Lexer('say "Hello, world!"');
    const tokens = lexer.scanTokens();

    expect(tokens).toHaveLength(3); // SAY, STRING, EOF
    expect(tokens[0].type).toBe(TokenType.SAY);
    expect(tokens[1].type).toBe(TokenType.STRING);
    expect(tokens[1].literal).toBe('Hello, world!');
    expect(tokens[2].type).toBe(TokenType.EOF);
  });

  it('should tokenize a variable assignment program correctly', () => {
    const lexer = new Lexer('hold mood = "chill"\nsay mood');
    const tokens = lexer.scanTokens();

    // HOLD, IDENTIFIER, EQUAL, STRING, SAY, IDENTIFIER, EOF
    const meaningful = tokens.filter(t => t.type !== TokenType.EOF);

    expect(meaningful).toHaveLength(6);
    expect(meaningful[0].type).toBe(TokenType.HOLD);
    expect(meaningful[1].type).toBe(TokenType.IDENTIFIER);
    expect(meaningful[1].lexeme).toBe('mood');
    expect(meaningful[2].type).toBe(TokenType.EQUAL);
    expect(meaningful[3].type).toBe(TokenType.STRING);
    expect(meaningful[3].literal).toBe('chill');
    expect(meaningful[4].type).toBe(TokenType.SAY);
    expect(meaningful[5].type).toBe(TokenType.IDENTIFIER);
    expect(meaningful[5].lexeme).toBe('mood');
  });

  it('should tokenize a conditional statement program correctly', () => {
    const lexer = new Lexer('hold is_mid = cap\nif (not is_mid) { say "This slaps!" } else { say "Mid" }');
    const tokens = lexer.scanTokens();

    expect(tokens[0].type).toBe(TokenType.HOLD);
    expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[2].type).toBe(TokenType.EQUAL);
    expect(tokens[3].type).toBe(TokenType.CAP);
    expect(tokens[4].type).toBe(TokenType.IF);
    expect(tokens[5].type).toBe(TokenType.LEFT_PAREN);
    expect(tokens[6].type).toBe(TokenType.NOT);
    expect(tokens[7].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[8].type).toBe(TokenType.RIGHT_PAREN);
    expect(tokens[9].type).toBe(TokenType.LEFT_BRACE);
  });

  it('should skip comments correctly', () => {
    const lexer = new Lexer('say "Hello"\nnote This is a comment\nsay "World"');
    const tokens = lexer.scanTokens();

    // SAY, STRING, SAY, STRING, EOF - comments are skipped
    const meaningful = tokens.filter(t => t.type !== TokenType.EOF);

    expect(meaningful).toHaveLength(4);
    expect(meaningful[0].type).toBe(TokenType.SAY);
    expect(meaningful[1].type).toBe(TokenType.STRING);
    expect(meaningful[1].literal).toBe('Hello');
    expect(meaningful[2].type).toBe(TokenType.SAY);
    expect(meaningful[3].type).toBe(TokenType.STRING);
    expect(meaningful[3].literal).toBe('World');
  });

  it('should track line and column numbers', () => {
    const lexer = new Lexer('hold x = 5\nsay x');
    const tokens = lexer.scanTokens();

    expect(tokens[0].line).toBe(1);
    expect(tokens[0].column).toBe(1);
    // 'say' is on line 2
    expect(tokens[4].line).toBe(2);
  });

  it('should handle boolean literals (bet/cap)', () => {
    const lexer = new Lexer('bet cap');
    const tokens = lexer.scanTokens();

    expect(tokens[0].type).toBe(TokenType.BET);
    expect(tokens[0].literal).toBe(true);
    expect(tokens[1].type).toBe(TokenType.CAP);
    expect(tokens[1].literal).toBe(false);
  });

  it('should handle logical operators', () => {
    const lexer = new Lexer('and or not');
    const tokens = lexer.scanTokens();

    const meaningful = tokens.filter(t => t.type !== TokenType.EOF);
    expect(meaningful[0].type).toBe(TokenType.AND);
    expect(meaningful[1].type).toBe(TokenType.OR);
    expect(meaningful[2].type).toBe(TokenType.NOT);
  });
});
