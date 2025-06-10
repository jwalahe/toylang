# Gen-Z Slang Lang Specification

## Overview

Gen-Z Slang Lang is a browser-first toy programming language whose keywords are Gen-Z slang terms. It aims to be fun, educational, and a bit humorous with its slang-based syntax.

## Reserved Keywords

| Keyword | Traditional Equivalent | Usage |
|---------|------------------------|-------|
| `yeet` | print/return | Output or throw value |
| `sus` | if | Conditional statement |
| `cap` | false | Boolean false |
| `bet` | true | Boolean true |
| `tea` | var/let | Variable declaration |
| `lowkey` | function | Function declaration |
| `vibe` | for/while | Loop construct |
| `fr` | == | Equality operator |
| `no_cap` | ! (not) | Negation operator |
| `slay` | break | Exit a loop |
| `bop` | + | Addition operator |
| `skrt` | - | Subtraction operator |
| `flex` | * | Multiplication operator |
| `yikes` | / | Division operator |
| `skrt` | - | Subtraction operator |
| `spill` | comment | Line comment |

## Data Types

| Type | Description | Example |
|------|-------------|---------|
| Number | Integers and floating points | `42`, `3.14` |
| String | Text enclosed in quotes | `"big mood"` |
| Boolean | Truth values | `bet`, `cap` |
| Array | List of values | `[1, 2, 3]` |
| Undefined | Absence of value | `undefined` |

## Grammar Outline

```
Program    → Statement*
Statement  → PrintStmt | VarDecl | IfStmt | LoopStmt | FunctionDecl | ReturnStmt
PrintStmt  → "yeet" Expression ";"
VarDecl    → "tea" IDENTIFIER "=" Expression ";"
IfStmt     → "sus" "(" Expression ")" Block ("else" Block)?
LoopStmt   → "vibe" "(" Expression ")" Block
FunctionDecl → "lowkey" IDENTIFIER "(" Parameters? ")" Block
ReturnStmt → "yeet" Expression ";"
Block      → "{" Statement* "}"
Expression → ... (standard expression grammar with operators)
```

## Sample Program: Hello World

```
yeet "Hello, bruh!";
```

## Sample Program: Variable Assignment

```
tea mood = "chill";
yeet mood;  // Outputs: chill
```

## Sample Program: Conditional

```
tea is_mid = cap;

sus (no_cap is_mid) {
  yeet "This slaps!";
} else {
  yeet "Mid af";
}
```

## Sample Program: Loop

```
tea count = 0;
vibe (count < 3) {
  yeet count;
  count = count bop 1;
}
// Outputs: 0, 1, 2
```

## Sample Program: Arithmetic Operations

```
tea a = 10;
tea b = 2;

tea sum = a bop b;      // Addition: 12
tea diff = a skrt b;    // Subtraction: 8
tea product = a flex b; // Multiplication: 20
tea quotient = a yikes b;  // Division: 5

yeet "Math results:";
yeet "10 + 2 = " bop sum;
yeet "10 - 2 = " bop diff;
yeet "10 * 2 = " bop product;
yeet "10 / 2 = " bop quotient;
```

## Sample Program: Function

```
lowkey rizz_calc(charisma, drip) {
  tea base = charisma flex drip;  // Multiplication
  tea bonus = base yikes 2;       // Division
  yeet base bop bonus bop 10;     // Addition
}

tea result = rizz_calc(5, 3);
yeet "Rizz level:";
yeet result;  // Outputs: Rizz level: 25 (15 + 7.5 + 10)
```

## Build Process and Grammar Generation

### Grammar Compilation

The language uses Nearley.js for parsing with the following grammar pipeline:

1. **Source Grammar**: `packages/core/src/grammar.ne` - The main grammar definition
2. **Generated Grammar**: The build process generates TypeScript grammar files
3. **Working Grammar**: `packages/core/src/grammar-esm-fixed.ts` - The production grammar used by the interpreter

### Build Commands

```bash
# Generate grammar from .ne file
pnpm run gen:grammar

# Build TypeScript to JavaScript
pnpm build

# Build specific packages
pnpm run build:core
pnpm run build:cli
```

### Grammar Generation Process

The grammar generation uses the following command:
```bash
nearleyc src/grammar.ne -o src/grammar.ts
```

However, the project currently uses `grammar-esm-fixed.ts` as the working grammar file due to compatibility improvements.

### Platform Compatibility

As of the latest version, the project includes pre-compiled distribution files to ensure cross-platform compatibility:

- **`packages/core/dist/`** - Compiled core language implementation
- **`packages/cli/dist/`** - Compiled CLI interface
- **`grammar-esm-fixed.ts`** - Working grammar file (committed to git)

This ensures the project works immediately after cloning on any platform (Windows, macOS, Linux) without requiring complex build dependencies.

### Development Workflow

1. **Local Development**: Modify source files in `src/` directories
2. **Grammar Changes**: Edit `grammar.ne` and run `pnpm run gen:grammar` if needed
3. **Building**: Run `pnpm build` to compile TypeScript
4. **Testing**: Use `node packages/cli/dist/index.js run examples/hello.genz`

## Recent Improvements and Bug Fixes

### BooleanLiteral Runtime Error Fix

**Issue Resolved**: Fixed critical runtime error when using boolean literals (`bet` and `cap`)

**Problem**: 
- Runtime error: `🔥 Runtime sus detected: Unknown expression type: BooleanLiteral`
- Grammar was generating `BooleanLiteral` AST nodes but interpreter didn't recognize the type

**Solution**:
- Added `BooleanLiteral` to AST type definitions in `packages/core/src/ast.ts`
- Updated interpreter to handle `BooleanLiteral` expressions in `packages/core/src/interpreter.ts`
- Added proper type safety for boolean literal evaluation

**Files Modified**:
- `ast.ts`: Added `BooleanLiteral` interface and type unions
- `interpreter.ts`: Added `evaluateBooleanLiteral()` method and case handling

### Windows Compatibility Improvements

**Issue Resolved**: Project failed to run on Windows machines after cloning

**Problem**:
- Missing essential generated files (`grammar-esm-fixed.ts`)
- Missing compiled distribution files (`dist/` directories)
- TypeScript compilation errors in auto-generated grammar files

**Solution**:
- Added working grammar file (`grammar-esm-fixed.ts`) to version control
- Included compiled distribution files for immediate functionality
- Removed problematic auto-generated files that caused build errors

**Impact**:
- ✅ Project now works immediately after `git clone` on all platforms
- ✅ No complex build dependencies required for basic usage
- ✅ Boolean literals work correctly in all language contexts
- ✅ All existing functionality preserved

### Testing Coverage

The language now includes comprehensive testing for:
- Boolean literal evaluation (`bet` and `cap` values)
- Cross-platform compatibility (Windows, macOS, Linux)
- End-to-end functionality with example programs
- Grammar parsing and AST generation
- Interpreter execution and error handling
