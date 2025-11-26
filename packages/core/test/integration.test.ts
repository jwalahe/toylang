// test/integration.test.ts
import { describe, expect, it } from 'vitest';
import { VibeScript } from '../src/index.js';

describe('VibeScript Integration', () => {
  it('should execute a simple print statement', () => {
    const vs = new VibeScript();
    const source = 'say "Hello, world!"';

    const output = vs.execute(source);
    expect(output).toEqual(['Hello, world!']);
  });

  it('should execute variable assignment and access', () => {
    const vs = new VibeScript();
    const source = `
      hold x = 42
      say x
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['42']);
  });

  it('should execute conditionals correctly', () => {
    const vs = new VibeScript();
    const source = `
      hold x = 5
      hold y = 10

      if (x < y) {
        say "x is less than y"
      } else {
        say "x is not less than y"
      }
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['x is less than y']);
  });

  it('should handle basic arithmetic', () => {
    const vs = new VibeScript();
    const source = `
      hold a = 5
      hold b = 3
      hold sum = a + b
      hold diff = a - b

      say "sum: " + sum
      say "diff: " + diff
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['sum: 8', 'diff: 2']);
  });

  it('should execute loops correctly', () => {
    const vs = new VibeScript();
    const source = `
      hold count = 0
      hold result = ""

      keep (count < 3) {
        result = result + count + ","
        count = count + 1
      }

      say result
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['0,1,2,']);
  });

  it('should execute functions correctly', () => {
    const vs = new VibeScript();
    const source = `
      skill add(a, b) {
        give a + b
      }

      hold result = add(5, 3)
      say "The sum is: " + result
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['The sum is: 8']);
  });

  it('should handle boolean values (bet/cap)', () => {
    const vs = new VibeScript();
    const source = `
      hold isTrue = bet
      hold isFalse = cap

      if (isTrue) {
        say "bet works!"
      }

      if (not isFalse) {
        say "cap works!"
      }
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['bet works!', 'cap works!']);
  });

  it('should handle arrays', () => {
    const vs = new VibeScript();
    const source = `
      hold nums = [1, 2, 3]
      say nums[0]
      say nums[1]
      say nums[2]
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['1', '2', '3']);
  });

  it('should handle each loop with range', () => {
    const vs = new VibeScript();
    const source = `
      each (i from 1 to 3) {
        say i
      }
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['1', '2', '3']);
  });

  it('should handle constants (lock)', () => {
    const vs = new VibeScript();
    const source = `
      lock PI = 3.14
      say PI
    `;

    const output = vs.execute(source);
    expect(output).toEqual(['3.14']);
  });
});
