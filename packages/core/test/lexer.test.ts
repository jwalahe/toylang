// test/lexer.test.ts
import { describe, it, expect } from 'vitest';
import lexer from '../src/lexer';

describe('Lexer', () => {
  it('should tokenize keywords correctly', () => {
    lexer.reset('yeet sus bet cap tea lowkey vibe fr no_cap slay bop skrt');
    
    // Filter out whitespace tokens
    const tokens = Array.from(lexer).filter(token => token.type !== 'ws');
    
    expect(tokens).toHaveLength(12);
    expect(tokens[0].type).toBe('yeet');
    expect(tokens[1].type).toBe('sus');
    expect(tokens[2].type).toBe('bet');
    expect(tokens[3].type).toBe('cap');
    expect(tokens[4].type).toBe('tea');
    expect(tokens[5].type).toBe('lowkey');
    expect(tokens[6].type).toBe('vibe');
    expect(tokens[7].type).toBe('fr');
    expect(tokens[8].type).toBe('no_cap');
    expect(tokens[9].type).toBe('slay');
    expect(tokens[10].type).toBe('bop');
    expect(tokens[11].type).toBe('skrt');
  });

  it('should tokenize literals and identifiers correctly', () => {
    lexer.reset('42 3.14 "hello world" variable_name');
    
    // Filter out whitespace tokens
    const tokens = Array.from(lexer).filter(token => token.type !== 'ws');
    
    expect(tokens).toHaveLength(4);
    expect(tokens[0].type).toBe('number');
    expect(tokens[0].value).toBe('42');
    expect(tokens[1].type).toBe('number');
    expect(tokens[1].value).toBe('3.14');
    expect(tokens[2].type).toBe('string');
    expect(tokens[2].value).toBe('"hello world"');
    expect(tokens[3].type).toBe('identifier');
    expect(tokens[3].value).toBe('variable_name');
  });

  it('should tokenize operators and punctuation correctly', () => {
    lexer.reset('( ) { } [ ] ; , = == > < >= <= !=');
    
    // Filter out whitespace tokens
    const tokens = Array.from(lexer).filter(token => token.type !== 'ws');
    
    // Update the expected token count to match the actual number of tokens
    expect(tokens).toHaveLength(15);
    expect(tokens[0].type).toBe('lparen');
    expect(tokens[1].type).toBe('rparen');
    expect(tokens[2].type).toBe('lbrace');
    expect(tokens[3].type).toBe('rbrace');
    expect(tokens[4].type).toBe('lbracket');
    expect(tokens[5].type).toBe('rbracket');
    expect(tokens[6].type).toBe('semicolon');
    expect(tokens[7].type).toBe('comma');
    expect(tokens[8].type).toBe('assign');
    expect(tokens[9].type).toBe('eq');
    expect(tokens[10].type).toBe('gt');
    expect(tokens[11].type).toBe('lt');
    expect(tokens[12].type).toBe('gteq');
    expect(tokens[13].type).toBe('lteq');
    expect(tokens[14].type).toBe('neq');
  });

  it('should tokenize a hello world program correctly', () => {
    lexer.reset('yeet "Hello, bruh!";');
    
    const tokens = Array.from(lexer);
    
    expect(tokens).toHaveLength(3);
    expect(tokens[0].type).toBe('yeet');
    expect(tokens[1].type).toBe('string');
    expect(tokens[1].value).toBe('"Hello, bruh!"');
    expect(tokens[2].type).toBe('semicolon');
  });

  it('should tokenize a variable assignment program correctly', () => {
    lexer.reset('tea mood = "chill"; yeet mood;');
    
    const tokens = Array.from(lexer);
    
    expect(tokens).toHaveLength(8);
    expect(tokens[0].type).toBe('tea');
    expect(tokens[1].type).toBe('identifier');
    expect(tokens[1].value).toBe('mood');
    expect(tokens[2].type).toBe('assign');
    expect(tokens[3].type).toBe('string');
    expect(tokens[3].value).toBe('"chill"');
    expect(tokens[4].type).toBe('semicolon');
    expect(tokens[5].type).toBe('yeet');
    expect(tokens[6].type).toBe('identifier');
    expect(tokens[6].value).toBe('mood');
    expect(tokens[7].type).toBe('semicolon');
  });

  it('should tokenize a conditional statement program correctly', () => {
    lexer.reset('tea is_mid = cap; sus (no_cap is_mid) { yeet "This slaps!"; } else { yeet "Mid af"; }');
    
    const tokens = Array.from(lexer);
    
    expect(tokens[0].type).toBe('tea');
    expect(tokens[1].type).toBe('identifier');
    expect(tokens[2].type).toBe('assign');
    expect(tokens[3].type).toBe('cap');
    expect(tokens[4].type).toBe('semicolon');
    expect(tokens[5].type).toBe('sus');
    expect(tokens[6].type).toBe('lparen');
    expect(tokens[7].type).toBe('no_cap');
    expect(tokens[8].type).toBe('identifier');
    expect(tokens[9].type).toBe('rparen');
    expect(tokens[10].type).toBe('lbrace');
  });

  it('should skip comments correctly', () => {
    lexer.reset('yeet "Hello"; // This is a comment\nyeet "World"; spill This is also a comment\nyeet "End";');
    
    // Since our lexer implementation now properly skips comments, we expect just the code tokens
    const tokens = Array.from(lexer);
    
    // We only expect the code tokens
    expect(tokens).toHaveLength(9);
    expect(tokens[0].type).toBe('yeet');
    expect(tokens[1].type).toBe('string');
    expect(tokens[1].value).toBe('"Hello"');
    expect(tokens[2].type).toBe('semicolon');
    expect(tokens[3].type).toBe('yeet');
    expect(tokens[4].type).toBe('string');
    expect(tokens[4].value).toBe('"World"');
    expect(tokens[5].type).toBe('semicolon');
    expect(tokens[6].type).toBe('yeet');
    expect(tokens[7].type).toBe('string');
    expect(tokens[7].value).toBe('"End"');
    expect(tokens[8].type).toBe('semicolon');
  });
});
