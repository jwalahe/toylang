@{%
const moo = require('moo');
const lexer = require('./lexer').default;
%}

@lexer lexer

# Top-level program
Program -> _ Statement:* _ {% ([, statements]) => ({ type: 'Program', body: statements.filter(s => s !== null) }) %}

# Statements
Statement -> 
    PrintStatement     {% id %}
  | VarDeclaration    {% id %}
  | IfStatement       {% id %}
  | LoopStatement     {% id %}
  | BlockStatement    {% id %}
  | FunctionDecl      {% id %}
  | ExprStatement     {% id %}
  | %ws              {% () => null %}

# Print statement (yeet)
PrintStatement -> %yeet _ Expression _ %semicolon {% 
  ([, , expr, , ]) => ({
    type: 'PrintStatement',
    expression: expr
  })
%}

# Variable declaration (tea)
VarDeclaration -> %tea _ %identifier _ %assign _ Expression _ %semicolon {% 
  ([, , id, , , , expr, , ]) => ({
    type: 'VarDeclaration',
    name: id.value,
    initializer: expr
  })
%}

# If statement (sus)
IfStatement -> %sus _ %lparen _ Expression _ %rparen _ Statement (_ "else" _ Statement):? {% 
  ([, , , , condition, , , , thenBranch, elsePart]) => ({
    type: 'IfStatement',
    condition,
    thenBranch,
    elseBranch: elsePart ? elsePart[3] : null
  })
%}

# Loop statement (vibe)
LoopStatement -> %vibe _ %lparen _ Expression _ %rparen _ Statement {% 
  ([, , , , condition, , , , body]) => ({
    type: 'LoopStatement',
    condition,
    body
  })
%}

# Block statement (grouped statements)
BlockStatement -> %lbrace _ Statement:* _ %rbrace {% 
  ([, , statements, , ]) => ({
    type: 'BlockStatement',
    statements: statements.filter(s => s !== null)
  })
%}

# Function declaration (lowkey)
FunctionDecl -> %lowkey _ %identifier _ %lparen _ Parameters _ %rparen _ BlockStatement {% 
  ([, , id, , , , params, , , , body]) => ({
    type: 'FunctionDeclaration',
    name: id.value,
    params,
    body
  })
%}

# Expression statement (an expression followed by a semicolon)
ExprStatement -> Expression _ %semicolon {% 
  ([expr, , ]) => ({
    type: 'ExpressionStatement',
    expression: expr
  })
%}

# Parameters for function declaration
Parameters -> 
    %identifier (_ %comma _ %identifier):* {% 
      ([first, rest]) => {
        const params = [first.value];
        if (rest) {
          rest.forEach(([, , , param]) => {
            params.push(param.value);
          });
        }
        return params;
      }
    %}
  | _ {% () => [] %}

# Expressions
Expression -> 
    Assignment {% id %}
  | EqualityExpr {% id %}

# Assignment expression
Assignment -> %identifier _ %assign _ Expression {% 
  ([id, , , , expr]) => ({
    type: 'BinaryExpression',
    operator: 'assign',
    left: { type: 'Identifier', name: id.value },
    right: expr
  })
%}

# Equality expressions (fr for equality)
EqualityExpr -> 
    ComparisonExpr _ %fr _ ComparisonExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'eq',
        left,
        right
      })
    %}
  | ComparisonExpr _ %neq _ ComparisonExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'neq',
        left,
        right
      })
    %}
  | ComparisonExpr {% id %}

# Comparison expressions
ComparisonExpr -> 
    AddExpr _ %lt _ AddExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'lt',
        left,
        right
      })
    %}
  | AddExpr _ %gt _ AddExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'gt',
        left,
        right
      })
    %}
  | AddExpr _ %lteq _ AddExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'lteq',
        left,
        right
      })
    %}
  | AddExpr _ %gteq _ AddExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'gteq',
        left,
        right
      })
    %}
  | AddExpr {% id %}

# Addition and subtraction (bop and skrt)
AddExpr -> 
    AddExpr _ %bop _ MultExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'add',
        left,
        right
      })
    %}
  | AddExpr _ %skrt _ MultExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'sub',
        left,
        right
      })
    %}
  | MultExpr {% id %}

# Multiplication and division (flex and yikes)
MultExpr -> 
    MultExpr _ %flex _ UnaryExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'mul',
        left,
        right
      })
    %}
  | MultExpr _ %yikes _ UnaryExpr {% 
      ([left, , , , right]) => ({
        type: 'BinaryExpression',
        operator: 'div',
        left,
        right
      })
    %}
  | UnaryExpr {% id %}

# Unary expressions (no_cap for negation)
UnaryExpr -> 
    %no_cap _ UnaryExpr {% 
      ([, , expr]) => ({
        type: 'UnaryExpression',
        operator: 'not',
        argument: expr
      })
    %}
  | CallExpr {% id %}

# Function calls
CallExpr -> 
    PrimaryExpr _ %lparen _ Arguments _ %rparen {% 
      ([callee, , , , args, , ]) => ({
        type: 'CallExpression',
        callee,
        arguments: args
      })
    %}
  | PrimaryExpr {% id %}

# Arguments for function calls
Arguments -> 
    Expression (_ %comma _ Expression):* {% 
      ([first, rest]) => {
        const args = [first];
        if (rest) {
          rest.forEach(([, , , expr]) => {
            args.push(expr);
          });
        }
        return args;
      }
    %}
  | _ {% () => [] %}

# Primary expressions (literals, identifiers, arrays, or grouped expressions)
PrimaryExpr -> 
    %number {% 
      (d) => ({
        type: 'Literal',
        value: Number(d[0].value)
      })
    %}
  | %string {% 
      (d) => ({
        type: 'Literal',
        value: d[0].value.slice(1, -1)  // Remove quotes
      })
    %}
  | %identifier {% 
      (d) => ({
        type: 'Identifier',
        name: d[0].value
      })
    %}
  | %bet {% 
      () => ({
        type: 'Literal',
        value: true
      })
    %}
  | %cap {% 
      () => ({
        type: 'Literal',
        value: false
      })
    %}
  | %lbracket _ ArrayElements _ %rbracket {% 
      ([, , elements, , ]) => ({
        type: 'ArrayExpression',
        elements
      })
    %}
  | %lparen _ Expression _ %rparen {% 
      ([, , expr, , ]) => expr
    %}

# Array elements
ArrayElements -> 
    Expression (_ %comma _ Expression):* {% 
      ([first, rest]) => {
        const elements = [first];
        if (rest) {
          rest.forEach(([, , , expr]) => {
            elements.push(expr);
          });
        }
        return elements;
      }
    %}
  | _ {% () => [] %}

# Optional whitespace
_ -> %ws:*  {% () => null %}
