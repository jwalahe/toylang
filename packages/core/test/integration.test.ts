// test/integration.test.ts
import { describe, expect, it } from 'vitest';
import { GenzLang } from '../src';

describe('GenzLang Integration', () => {
  it('should execute a simple print statement', () => {
    const genz = new GenzLang();
    const source = 'yeet "Hello, world!";';
    
    const output = genz.execute(source);
    expect(output).toEqual(['Hello, world!']);
  });
  
  it('should execute variable assignment and access', () => {
    const genz = new GenzLang();
    const source = `
      tea x = 42;
      yeet x;
    `;
    
    const output = genz.execute(source);
    expect(output).toEqual(['42']);
  });
  
  it('should execute conditionals correctly', () => {
    const genz = new GenzLang();
    const source = `
      tea x = 5;
      tea y = 10;
      
      sus (x < y) {
        yeet "x is less than y";
      } else {
        yeet "x is not less than y";
      }
    `;
    
    const output = genz.execute(source);
    expect(output).toEqual(['x is less than y']);
  });
  
  it('should handle basic arithmetic', () => {
    const genz = new GenzLang();
    const source = `
      tea a = 5;
      tea b = 3;
      tea sum = a bop b;
      tea diff = a skrt b;
      
      yeet "sum: " bop sum;
      yeet "diff: " bop diff;
    `;
    
    const output = genz.execute(source);
    expect(output).toEqual(['sum: 8', 'diff: 2']);
  });
  
  it('should execute loops correctly', () => {
    const genz = new GenzLang();
    const source = `
      tea count = 0;
      tea result = "";
      
      vibe (count < 3) {
        result = result bop count bop ",";
        count = count bop 1;
      }
      
      yeet result;
    `;
    
    const output = genz.execute(source);
    expect(output).toEqual(['0,1,2,']);
  });
  
  it('should execute functions correctly', () => {
    const genz = new GenzLang();
    const source = `
      lowkey add(a, b) {
        yeet a bop b;
      }
      
      tea result = add(5, 3);
      yeet "The sum is: " bop result;
    `;
    
    const output = genz.execute(source);
    expect(output).toEqual(['The sum is: 8']);
  });
});
