"use strict";
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
    function id(x) { return x[0]; }
    const moo = require('moo');
    const lexer = require('./lexer').default;
    var grammar = {
        Lexer: lexer,
        ParserRules: [
            { "name": "Program$ebnf$1", "symbols": [] },
            { "name": "Program$ebnf$1", "symbols": ["Program$ebnf$1", "Statement"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "Program", "symbols": ["_", "Program$ebnf$1", "_"], "postprocess": ([, statements]) => ({ type: 'Program', body: statements.filter(s => s !== null) }) },
            { "name": "Statement", "symbols": ["PrintStatement"], "postprocess": id },
            { "name": "Statement", "symbols": ["VarDeclaration"], "postprocess": id },
            { "name": "Statement", "symbols": ["IfStatement"], "postprocess": id },
            { "name": "Statement", "symbols": ["LoopStatement"], "postprocess": id },
            { "name": "Statement", "symbols": ["BlockStatement"], "postprocess": id },
            { "name": "Statement", "symbols": ["FunctionDecl"], "postprocess": id },
            { "name": "Statement", "symbols": ["ExprStatement"], "postprocess": id },
            { "name": "Statement", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": () => null },
            { "name": "PrintStatement", "symbols": [(lexer.has("yeet") ? { type: "yeet" } : yeet), "_", "Expression", "_", (lexer.has("semicolon") ? { type: "semicolon" } : semicolon)], "postprocess": ([, , expr, ,]) => ({
                    type: 'PrintStatement',
                    expression: expr
                })
            },
            { "name": "VarDeclaration", "symbols": [(lexer.has("tea") ? { type: "tea" } : tea), "_", (lexer.has("identifier") ? { type: "identifier" } : identifier), "_", (lexer.has("assign") ? { type: "assign" } : assign), "_", "Expression", "_", (lexer.has("semicolon") ? { type: "semicolon" } : semicolon)], "postprocess": ([, , id, , , , expr, ,]) => ({
                    type: 'VarDeclaration',
                    name: id.value,
                    initializer: expr
                })
            },
            { "name": "IfStatement$ebnf$1$subexpression$1", "symbols": ["_", { "literal": "else" }, "_", "Statement"] },
            { "name": "IfStatement$ebnf$1", "symbols": ["IfStatement$ebnf$1$subexpression$1"], "postprocess": id },
            { "name": "IfStatement$ebnf$1", "symbols": [], "postprocess": function (d) { return null; } },
            { "name": "IfStatement", "symbols": [(lexer.has("sus") ? { type: "sus" } : sus), "_", (lexer.has("lparen") ? { type: "lparen" } : lparen), "_", "Expression", "_", (lexer.has("rparen") ? { type: "rparen" } : rparen), "_", "Statement", "IfStatement$ebnf$1"], "postprocess": ([, , , , condition, , , , thenBranch, elsePart]) => ({
                    type: 'IfStatement',
                    condition,
                    thenBranch,
                    elseBranch: elsePart ? elsePart[3] : null
                })
            },
            { "name": "LoopStatement", "symbols": [(lexer.has("vibe") ? { type: "vibe" } : vibe), "_", (lexer.has("lparen") ? { type: "lparen" } : lparen), "_", "Expression", "_", (lexer.has("rparen") ? { type: "rparen" } : rparen), "_", "Statement"], "postprocess": ([, , , , condition, , , , body]) => ({
                    type: 'LoopStatement',
                    condition,
                    body
                })
            },
            { "name": "BlockStatement$ebnf$1", "symbols": [] },
            { "name": "BlockStatement$ebnf$1", "symbols": ["BlockStatement$ebnf$1", "Statement"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "BlockStatement", "symbols": [(lexer.has("lbrace") ? { type: "lbrace" } : lbrace), "_", "BlockStatement$ebnf$1", "_", (lexer.has("rbrace") ? { type: "rbrace" } : rbrace)], "postprocess": ([, , statements, ,]) => ({
                    type: 'BlockStatement',
                    statements: statements.filter(s => s !== null)
                })
            },
            { "name": "FunctionDecl", "symbols": [(lexer.has("lowkey") ? { type: "lowkey" } : lowkey), "_", (lexer.has("identifier") ? { type: "identifier" } : identifier), "_", (lexer.has("lparen") ? { type: "lparen" } : lparen), "_", "Parameters", "_", (lexer.has("rparen") ? { type: "rparen" } : rparen), "_", "BlockStatement"], "postprocess": ([, , id, , , , params, , , , body]) => ({
                    type: 'FunctionDeclaration',
                    name: id.value,
                    params,
                    body
                })
            },
            { "name": "ExprStatement", "symbols": ["Expression", "_", (lexer.has("semicolon") ? { type: "semicolon" } : semicolon)], "postprocess": ([expr, ,]) => ({
                    type: 'ExpressionStatement',
                    expression: expr
                })
            },
            { "name": "Parameters$ebnf$1", "symbols": [] },
            { "name": "Parameters$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? { type: "comma" } : comma), "_", (lexer.has("identifier") ? { type: "identifier" } : identifier)] },
            { "name": "Parameters$ebnf$1", "symbols": ["Parameters$ebnf$1", "Parameters$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "Parameters", "symbols": [(lexer.has("identifier") ? { type: "identifier" } : identifier), "Parameters$ebnf$1"], "postprocess": ([first, rest]) => {
                    const params = [first.value];
                    if (rest) {
                        rest.forEach(([, , , param]) => {
                            params.push(param.value);
                        });
                    }
                    return params;
                }
            },
            { "name": "Parameters", "symbols": ["_"], "postprocess": () => [] },
            { "name": "Expression", "symbols": ["Assignment"], "postprocess": id },
            { "name": "Expression", "symbols": ["EqualityExpr"], "postprocess": id },
            { "name": "Assignment", "symbols": [(lexer.has("identifier") ? { type: "identifier" } : identifier), "_", (lexer.has("assign") ? { type: "assign" } : assign), "_", "Expression"], "postprocess": ([id, , , , expr]) => ({
                    type: 'BinaryExpression',
                    operator: 'assign',
                    left: { type: 'Identifier', name: id.value },
                    right: expr
                })
            },
            { "name": "EqualityExpr", "symbols": ["ComparisonExpr", "_", (lexer.has("fr") ? { type: "fr" } : fr), "_", "ComparisonExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'eq',
                    left,
                    right
                })
            },
            { "name": "EqualityExpr", "symbols": ["ComparisonExpr", "_", (lexer.has("neq") ? { type: "neq" } : neq), "_", "ComparisonExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'neq',
                    left,
                    right
                })
            },
            { "name": "EqualityExpr", "symbols": ["ComparisonExpr"], "postprocess": id },
            { "name": "ComparisonExpr", "symbols": ["AddExpr", "_", (lexer.has("lt") ? { type: "lt" } : lt), "_", "AddExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'lt',
                    left,
                    right
                })
            },
            { "name": "ComparisonExpr", "symbols": ["AddExpr", "_", (lexer.has("gt") ? { type: "gt" } : gt), "_", "AddExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'gt',
                    left,
                    right
                })
            },
            { "name": "ComparisonExpr", "symbols": ["AddExpr", "_", (lexer.has("lteq") ? { type: "lteq" } : lteq), "_", "AddExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'lteq',
                    left,
                    right
                })
            },
            { "name": "ComparisonExpr", "symbols": ["AddExpr", "_", (lexer.has("gteq") ? { type: "gteq" } : gteq), "_", "AddExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'gteq',
                    left,
                    right
                })
            },
            { "name": "ComparisonExpr", "symbols": ["AddExpr"], "postprocess": id },
            { "name": "AddExpr", "symbols": ["AddExpr", "_", (lexer.has("bop") ? { type: "bop" } : bop), "_", "MultExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'add',
                    left,
                    right
                })
            },
            { "name": "AddExpr", "symbols": ["AddExpr", "_", (lexer.has("skrt") ? { type: "skrt" } : skrt), "_", "MultExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'sub',
                    left,
                    right
                })
            },
            { "name": "AddExpr", "symbols": ["MultExpr"], "postprocess": id },
            { "name": "MultExpr", "symbols": ["MultExpr", "_", (lexer.has("flex") ? { type: "flex" } : flex), "_", "UnaryExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'mul',
                    left,
                    right
                })
            },
            { "name": "MultExpr", "symbols": ["MultExpr", "_", (lexer.has("yikes") ? { type: "yikes" } : yikes), "_", "UnaryExpr"], "postprocess": ([left, , , , right]) => ({
                    type: 'BinaryExpression',
                    operator: 'div',
                    left,
                    right
                })
            },
            { "name": "MultExpr", "symbols": ["UnaryExpr"], "postprocess": id },
            { "name": "UnaryExpr", "symbols": [(lexer.has("no_cap") ? { type: "no_cap" } : no_cap), "_", "UnaryExpr"], "postprocess": ([, , expr]) => ({
                    type: 'UnaryExpression',
                    operator: 'not',
                    argument: expr
                })
            },
            { "name": "UnaryExpr", "symbols": ["CallExpr"], "postprocess": id },
            { "name": "CallExpr", "symbols": ["PrimaryExpr", "_", (lexer.has("lparen") ? { type: "lparen" } : lparen), "_", "Arguments", "_", (lexer.has("rparen") ? { type: "rparen" } : rparen)], "postprocess": ([callee, , , , args, ,]) => ({
                    type: 'CallExpression',
                    callee,
                    arguments: args
                })
            },
            { "name": "CallExpr", "symbols": ["PrimaryExpr"], "postprocess": id },
            { "name": "Arguments$ebnf$1", "symbols": [] },
            { "name": "Arguments$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? { type: "comma" } : comma), "_", "Expression"] },
            { "name": "Arguments$ebnf$1", "symbols": ["Arguments$ebnf$1", "Arguments$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "Arguments", "symbols": ["Expression", "Arguments$ebnf$1"], "postprocess": ([first, rest]) => {
                    const args = [first];
                    if (rest) {
                        rest.forEach(([, , , expr]) => {
                            args.push(expr);
                        });
                    }
                    return args;
                }
            },
            { "name": "Arguments", "symbols": ["_"], "postprocess": () => [] },
            { "name": "PrimaryExpr", "symbols": [(lexer.has("number") ? { type: "number" } : number)], "postprocess": (d) => ({
                    type: 'Literal',
                    value: Number(d[0].value)
                })
            },
            { "name": "PrimaryExpr", "symbols": [(lexer.has("string") ? { type: "string" } : string)], "postprocess": (d) => ({
                    type: 'Literal',
                    value: d[0].value.slice(1, -1) // Remove quotes
                })
            },
            { "name": "PrimaryExpr", "symbols": [(lexer.has("identifier") ? { type: "identifier" } : identifier)], "postprocess": (d) => ({
                    type: 'Identifier',
                    name: d[0].value
                })
            },
            { "name": "PrimaryExpr", "symbols": [(lexer.has("bet") ? { type: "bet" } : bet)], "postprocess": () => ({
                    type: 'Literal',
                    value: true
                })
            },
            { "name": "PrimaryExpr", "symbols": [(lexer.has("cap") ? { type: "cap" } : cap)], "postprocess": () => ({
                    type: 'Literal',
                    value: false
                })
            },
            { "name": "PrimaryExpr", "symbols": [(lexer.has("lbracket") ? { type: "lbracket" } : lbracket), "_", "ArrayElements", "_", (lexer.has("rbracket") ? { type: "rbracket" } : rbracket)], "postprocess": ([, , elements, ,]) => ({
                    type: 'ArrayExpression',
                    elements
                })
            },
            { "name": "PrimaryExpr", "symbols": [(lexer.has("lparen") ? { type: "lparen" } : lparen), "_", "Expression", "_", (lexer.has("rparen") ? { type: "rparen" } : rparen)], "postprocess": ([, , expr, ,]) => expr
            },
            { "name": "ArrayElements$ebnf$1", "symbols": [] },
            { "name": "ArrayElements$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? { type: "comma" } : comma), "_", "Expression"] },
            { "name": "ArrayElements$ebnf$1", "symbols": ["ArrayElements$ebnf$1", "ArrayElements$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "ArrayElements", "symbols": ["Expression", "ArrayElements$ebnf$1"], "postprocess": ([first, rest]) => {
                    const elements = [first];
                    if (rest) {
                        rest.forEach(([, , , expr]) => {
                            elements.push(expr);
                        });
                    }
                    return elements;
                }
            },
            { "name": "ArrayElements", "symbols": ["_"], "postprocess": () => [] },
            { "name": "_$ebnf$1", "symbols": [] },
            { "name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null }
        ],
        ParserStart: "Program"
    };
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = grammar;
    }
    else {
        window.grammar = grammar;
    }
})();
//# sourceMappingURL=grammar.js.map