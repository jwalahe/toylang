# Gen-Z Slang Lang

A browser-first toy programming language that uses Gen-Z slang terms as keywords. This project is designed to be fun, educational, and a bit humorous while demonstrating modern language implementation techniques using TypeScript.

## Project Overview

Gen-Z Slang Lang is a complete programming language implementation featuring:
- Custom lexical analysis and parsing
- Abstract syntax tree generation
- Tree-walking interpreter
- Command-line interface
- Interactive web playground
- Comprehensive test suite

## Architecture Overview

### Monorepo Structure

The project is organized as a pnpm workspace with the following packages:

#### Core Package (`packages/core`)
The heart of the language implementation containing:
- **Lexer**: Tokenizes source code using the `moo` library, handling Gen-Z slang keywords like `yeet`, `sus`, `tea`, etc.
- **Grammar**: Nearley-based grammar definition that parses tokens into an Abstract Syntax Tree
- **AST Types**: TypeScript definitions for all language constructs (statements, expressions, literals)
- **Interpreter**: Tree-walking interpreter that executes the AST with environment-based variable scoping
- **Main API**: GenzLang class that orchestrates parsing and execution

#### CLI Package (`packages/cli`)
Command-line interface built with Commander.js providing:
- File execution capabilities
- Interactive REPL mode
- Error reporting with Gen-Z themed messages

#### Playground Package (`playground`)
React-based web application featuring:
- Monaco Editor with custom Gen-Z syntax highlighting
- Real-time code execution
- Output display
- Modern UI with Gen-Z aesthetics

#### Examples Directory
Collection of sample programs demonstrating language features:
- Hello world programs
- Arithmetic operations
- Control flow examples
- Function definitions
- Comprehensive showcase programs

### Language Implementation Details

#### Lexical Analysis
The lexer recognizes:
- **Keywords**: Gen-Z slang terms mapped to traditional programming concepts
- **Operators**: Both slang-based (`bop`, `skrt`, `flex`, `yikes`) and traditional (`+`, `-`, `*`, `/`)
- **Literals**: Numbers, strings, booleans (`bet`/`cap`)
- **Punctuation**: Brackets, semicolons, commas
- **Comments**: Both traditional (`//`) and slang-based (`spill`)

#### Grammar and Parsing
The grammar supports:
- **Statements**: Print statements (`yeet`), variable declarations (`tea`), conditionals (`sus`), loops (`vibe`)
- **Expressions**: Binary operations, unary operations, function calls, array access
- **Functions**: Declaration (`lowkey`) and invocation with parameter passing
- **Scoping**: Block-scoped variables with lexical scoping rules

#### Abstract Syntax Tree
Comprehensive AST node types including:
- Program nodes containing statement arrays
- Statement types for all language constructs
- Expression types for all operations and values
- Proper type safety through TypeScript interfaces

#### Interpreter Design
Tree-walking interpreter featuring:
- **Environment-based scoping**: Nested environments for variable resolution
- **Error handling**: Custom error types with Gen-Z themed messages
- **Safety mechanisms**: Operation limits to prevent infinite loops
- **Value system**: Support for numbers, strings, booleans, arrays, and functions

### Technology Stack

#### Core Technologies
- **TypeScript**: Primary language for type safety and modern JavaScript features
- **Nearley**: Parser generator for creating the language grammar
- **Moo**: Lexer generator for tokenization
- **Vitest**: Testing framework for unit and integration tests

#### Development Tools
- **pnpm**: Package manager and workspace management
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **Monaco Editor**: Code editor component for the playground

#### Build and Deployment
- **TypeScript Compiler**: Builds the core and CLI packages
- **Vite**: Builds and serves the playground application
- **GitHub Actions**: Potential CI/CD pipeline (infrastructure ready)

### Language Features

#### Data Types
- **Numbers**: Integers and floating-point values (JavaScript number type)
  - Examples: `42`, `3.14`, `-10`
  - Arithmetic operations supported
- **Strings**: Text literals with double quotes
  - Examples: `"Hello, bruh!"`, `"This is bussin'"`
  - String concatenation with `bop` operator
- **Booleans**: Gen-Z slang boolean literals
  - `bet` → `true`
  - `cap` → `false`
  - Used in conditionals and logical expressions
- **Arrays**: Dynamic arrays with bracket notation (planned feature)
- **Functions**: First-class functions with lexical closures
  - Function declarations create callable objects
  - Parameters passed by value
  - Return values supported via expressions

#### Control Structures
- **Conditionals**: `sus` (if) statements with optional `else` branches
  - Syntax: `sus (condition) { statements } else { statements }`
  - Condition must be truthy/falsy expression
  - Block statements required (braces mandatory)
- **Loops**: `vibe` (while) loops with condition-based iteration
  - Syntax: `vibe (condition) { statements }`
  - Infinite loop protection with operation counting
  - No break/continue statements (yet)
- **Functions**: `lowkey` function declarations with parameters
  - Syntax: `lowkey function_name(param1, param2) { statements }`
  - Functions are first-class values
  - Lexical scoping with closure support

#### Operators
- **Arithmetic**: 
  - Addition: `bop` or `+` (string concatenation or numeric addition)
  - Subtraction: `skrt` or `-`
  - Multiplication: `flex` or `*`
  - Division: `yikes` or `/` (includes division by zero checking)
- **Comparison**: 
  - Equality: `fr` (==)
  - Inequality: `neq` (!=)
  - Less than: `<` 
  - Greater than: `>`
  - Less than or equal: `<=`
  - Greater than or equal: `>=`
- **Logical**: 
  - Negation: `no_cap` (logical NOT)
- **Assignment**: 
  - Variable assignment: `=`
  - Assignment is an expression that returns the assigned value

#### Variable Declaration and Scoping
- **Variable Declaration**: `tea variable_name = expression;`
  - Variables must be declared before use
  - Block-scoped within `{}` braces
  - Function parameters create local variables
- **Scoping Rules**:
  - Lexical (static) scoping
  - Inner scopes can access outer scope variables
  - Variable shadowing allowed
  - Function closures capture lexical environment

#### Statement Types
- **Print Statement**: `yeet expression;` - outputs value to console
- **Variable Declaration**: `tea name = value;` - creates new variable
- **Expression Statement**: Any expression followed by `;`
- **Block Statement**: `{ statements... }` - groups statements with new scope
- **Return Statement**: Implicit returns from function expressions

#### Expression Evaluation
- **Operator Precedence** (highest to lowest):
  1. Function calls, array access
  2. Unary operators (`no_cap`)
  3. Multiplication (`flex`), Division (`yikes`)
  4. Addition (`bop`), Subtraction (`skrt`)
  5. Comparison operators (`<`, `>`, `<=`, `>=`)
  6. Equality operators (`fr`, `neq`)
  7. Assignment (`=`)
- **Type Coercion**:
  - String concatenation: any type + string → string
  - Arithmetic: requires numbers (throws error otherwise)
  - Truthiness: `false`, `0`, `""`, `null`, `undefined` are falsy

### Error Handling

The interpreter includes comprehensive error handling:
- **Syntax Errors**: Clear messages for parsing failures
- **Runtime Errors**: Type errors, undefined variables, infinite loop detection
- **Custom Error Types**: GenzSyntaxError and GenzRuntimeError with themed messaging

### Testing Strategy

The project includes multiple testing layers:
- **Unit Tests**: Individual component testing for lexer, parser, and interpreter
- **Integration Tests**: End-to-end language feature testing
- **Example Programs**: Real-world usage examples that serve as tests

### Development Workflow

#### Grammar Development
- Grammar rules defined in Nearley format
- Grammar compilation generates TypeScript parser
- AST node types manually maintained for type safety

#### Interpreter Development
- Tree-walking approach for simplicity and clarity
- Environment-based variable scoping
- Visitor pattern for AST traversal

#### Playground Integration
- Real-time compilation and execution
- Custom Monaco language definition
- Error display and output formatting

### Extension Points

The architecture supports future enhancements:
- **Additional Language Features**: Classes, modules, advanced data structures
- **Optimization**: Bytecode compilation, just-in-time compilation
- **Tooling**: Debugger, language server protocol, IDE extensions
- **Backends**: Code generation to other languages or platforms

### Current Limitations

Known areas for improvement:
- **Performance**: Tree-walking interpreter is slower than bytecode alternatives
- **Error Recovery**: Parser doesn't recover well from syntax errors
- **Language Server**: No IDE integration beyond syntax highlighting
- **Standard Library**: Limited built-in functions and utilities

### File Organization

Key files and their purposes:
- `packages/core/src/grammar.ne`: Nearley grammar definition
- `packages/core/src/lexer.ts`: Moo-based tokenizer
- `packages/core/src/ast.ts`: TypeScript AST type definitions
- `packages/core/src/interpreter.ts`: Tree-walking interpreter implementation
- `packages/core/src/index.ts`: Main API and error handling
- `playground/src/App.tsx`: React playground application
- `examples/`: Sample programs demonstrating language features

## Implementation Context for AI Agents

### Grammar Ambiguity
The current Nearley grammar has known ambiguity issues that result in multiple parse trees. This is primarily due to overlapping expression and statement rules. When working on the grammar:
- Consider left-factoring common prefixes
- Use precedence rules to resolve operator conflicts
- Be careful with epsilon productions that can match empty strings

### Interpreter Special Cases
The interpreter contains hardcoded workarounds for specific test cases, particularly in loop handling. When extending the interpreter:
- Remove special case handling in favor of proper grammar fixes
- Maintain the environment-based scoping system
- Preserve the operation counting mechanism for infinite loop detection

### AST Type System
The AST uses dual function declaration types (`FunctionDeclaration` and `FunctionDecl`) due to grammar evolution. When modifying AST types:
- Maintain backward compatibility with existing grammar output
- Consider consolidating duplicate types after grammar stabilization
- Ensure all AST nodes implement the base `Node` interface

### Error Handling Philosophy
Error messages use Gen-Z themed language to maintain the project's humorous tone while providing useful debugging information. When adding new error types:
- Use emojis and Gen-Z slang in error messages
- Include location information when available
- Maintain the distinction between syntax and runtime errors

### Testing Approach
Tests cover both individual components and integration scenarios. When adding new features:
- Write unit tests for lexer token recognition
- Add grammar tests for new syntax constructs
- Include integration tests for end-to-end functionality
- Update example programs to demonstrate new features

This architecture provides a solid foundation for a toy programming language while maintaining extensibility for future enhancements. The TypeScript implementation ensures type safety throughout the language pipeline, while the modular design allows for independent development of different components.
