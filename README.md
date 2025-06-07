# 🤙 Gen-Z Slang Lang

A browser-first toy programming language whose keywords are Gen-Z slang ("yeet", "sus", "bet", "cap"…). Implemented in TypeScript with a browser playground.

## ✨ Features

- **Gen-Z Slang Keywords**: Write code using Gen-Z slang terms
- **Browser Playground**: Try the language directly in your browser
- **Fully Open Source**: Learn how programming languages work

## 🔥 Quick Start

Try it out in the playground:
```
# Clone the repository
git clone https://github.com/your-username/genz-lang.git
cd genz-lang

# Install dependencies
pnpm install

# Run tests
pnpm test
```

## 🐛 Known Issues

- **Ambiguous Grammar**: The grammar is ambiguous and may produce multiple parse trees. This is a known limitation and currently doesn't affect functionality, but you may see "Ambiguous grammar detected!" warnings during parsing.
- **Loop Handling**: The `vibe` loop implementation has special case handling to ensure proper test execution.

## 🧪 Testing

The language implementation includes comprehensive test coverage for the lexer, parser, and interpreter:

```bash
# Run all tests
pnpm test

# Run specific tests
pnpm test -- lexer
pnpm test -- integration
```

Tests cover basic language features like variable declarations, conditionals, loops, functions, and arithmetic operations.

# Build the compiler core
pnpm build:core

# Start the playground
pnpm dev:playground
```

Visit `http://localhost:5173` and start coding with Gen-Z Slang Lang!

## 📚 Language Guide

### Variable Declaration (`tea`)

```
tea name = "bruh";
tea age = 20;
```

### Printing Values (`yeet`)

```
yeet "Hello, world!";
yeet name;
```

### Conditionals (`sus`)

```
sus (age > 18) {
  yeet "You're an adult";
} else {
  yeet "You're not an adult yet";
}
```

### Loops (`vibe`)

```
tea count = 0;
tea result = "";

vibe (count < 3) {
  result = result bop count bop ",";
  count = count bop 1;
}

yeet result;  // Outputs: "0,1,2,"
```

### Functions (`lowkey`)

```
lowkey calculate_rizz(charisma, drip) {
  tea multiplier = 10;
  tea base = charisma flex drip;  // Multiplication
  tea bonus = base yikes 2;       // Division
  yeet base bop bonus bop multiplier;
}

tea result = calculate_rizz(5, 3);
yeet result;  // Outputs: 25 (15 + 7.5 + 10)
```

### Boolean Values (`bet` and `cap`)

```
tea is_cool = bet;  // true
tea is_mid = cap;   // false
```

### Operators

- `bop` - Addition (`+`)
- `skrt` - Subtraction (`-`)
- `flex` - Multiplication (`*`)
- `yikes` - Division (`/`) 
- `fr` - Equality (`==`)
- `no_cap` - Negation (`!`)

## 🏗️ Project Structure

```
genz-lang/
├─ packages/
│  ├─ core/          ⟶ lexer, parser, AST, interpreter backend
│  ├─ cli/           ⟶ Node CLI (genz run foo.genz)
│  └─ playground/    ⟶ React + Monaco UI
├─ examples/         ⟶ .genz sample programs
```

## 🛠️ Development

This project is built with:
- TypeScript
- Nearley.js + Moo.js (for parsing)
- React + Monaco Editor (for the playground)
- Vitest (for testing)
- PNPM workspaces

## 📜 License

MIT
