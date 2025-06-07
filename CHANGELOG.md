# Changelog

All notable changes to the Gen-Z Slang Lang project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **[2025-06-07] BooleanLiteral Runtime Error** - Fixed critical runtime error when using boolean literals (`bet` and `cap`)
  - **Issue**: Interpreter was throwing `🔥 Runtime sus detected: Unknown expression type: BooleanLiteral` when executing code with boolean literals
  - **Root Cause**: Grammar files were generating AST nodes with `type: 'BooleanLiteral'` but the AST type definitions and interpreter didn't recognize this type
  - **Files Modified**:
    - `packages/core/src/ast.ts`: Added `BooleanLiteral` to NodeType union, Expression union, and created BooleanLiteral interface
    - `packages/core/src/interpreter.ts`: Added BooleanLiteral import, added case for 'BooleanLiteral' in evaluate() method, added evaluateBooleanLiteral() method
  - **Impact**: Boolean literals now work correctly in all contexts (variable assignments, conditionals, expressions)
  - **Testing**: Verified with `examples/hello.genz` and simple boolean test cases
  - **Details**: 
    - Added `'BooleanLiteral'` to `NodeType` union type
    - Created `BooleanLiteral` interface with `type: 'BooleanLiteral'` and `value: boolean`
    - Added `BooleanLiteral` to `Expression` union type
    - Added `BooleanLiteral` case in interpreter's `evaluate()` method
    - Created `evaluateBooleanLiteral()` method that returns the boolean value directly

### Known Issues
- **Grammar Ambiguity**: Parser reports "Ambiguous grammar detected! 4 parse trees found" for complex programs
  - **Status**: Does not affect functionality - programs execute correctly
  - **Cause**: Overlapping expression and statement rules in Nearley grammar
  - **Priority**: Low - functional issue only, no runtime impact

## Version History

### [0.1.0] - Initial Release
- Initial implementation of Gen-Z Slang Lang
- Core language features: variables, functions, conditionals, loops
- CLI interface with REPL mode
- Web playground with Monaco editor
- Comprehensive test suite
