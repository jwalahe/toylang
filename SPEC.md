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
