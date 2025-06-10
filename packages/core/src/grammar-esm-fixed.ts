// Generated grammar converted to ES modules
import lexer from './lexer.js';

function id(x: any) { return x[0]; }

// Ensure we're using the proper format for the lexer
const grammar = {
    Lexer: lexer as any,
    ParserRules: [
    {"name": "Program$ebnf$1", "symbols": []},
    {"name": "Program$ebnf$1", "symbols": ["Program$ebnf$1", "Statement"], "postprocess": function arrpush(d: any) {return d[0].concat([d[1]]);}},
    {"name": "Program", "symbols": ["_", "Program$ebnf$1", "_"], "postprocess": ([, statements]: any) => ({ type: 'Program', body: statements.filter((s: any) => s !== null) })},
    {"name": "Statement", "symbols": ["PrintStatement"], "postprocess": id},
    {"name": "Statement", "symbols": ["VarDeclaration"], "postprocess": id},
    {"name": "Statement", "symbols": ["IfStatement"], "postprocess": id},
    {"name": "Statement", "symbols": ["LoopStatement"], "postprocess": id},
    {"name": "Statement", "symbols": ["BlockStatement"], "postprocess": id},
    {"name": "Statement", "symbols": ["FunctionDecl"], "postprocess": id},
    {"name": "Statement", "symbols": ["ExprStatement"], "postprocess": id},
    {"name": "PrintStatement", "symbols": ["yeet", "_", "Expression", "_", "semicolon"], "postprocess": ([,, expr]: any[]) => ({ type: 'PrintStatement', expression: expr })},
    {"name": "VarDeclaration", "symbols": ["tea", "_", "identifier", "_", "assign", "_", "Expression", "_", "semicolon"], "postprocess": ([,, name,, ,, value]: any[]) => ({ type: 'VarDeclaration', name: name.value, initializer: value })},
    {"name": "IfStatement", "symbols": ["sus", "_", "lparen", "_", "Expression", "_", "rparen", "_", "Statement"], "postprocess": ([,,,, condition,,,, then]: any[]) => ({ type: 'IfStatement', condition, thenBranch: then, elseBranch: null })},
    {"name": "IfStatement", "symbols": ["sus", "_", "lparen", "_", "Expression", "_", "rparen", "_", "Statement", "_", (lexer as any).has("else") ? {type: "else"} : "else", "_", "Statement"], "postprocess": ([,,,, condition,,,, then,,,, else_]: any[]) => ({ type: 'IfStatement', condition, thenBranch: then, elseBranch: else_ })},
    {"name": "LoopStatement", "symbols": ["vibe", "_", "lparen", "_", "Expression", "_", "rparen", "_", "Statement"], "postprocess": ([,,,, condition,,,, body]: any[]) => ({ type: 'LoopStatement', condition, body })},
    {"name": "BlockStatement", "symbols": ["lbrace", "_", "BlockStatements", "_", "rbrace"], "postprocess": ([,, statements]: any[]) => ({ type: 'BlockStatement', statements })},
    {"name": "BlockStatements$ebnf$1", "symbols": []},
    {"name": "BlockStatements$ebnf$1", "symbols": ["BlockStatements$ebnf$1", "Statement"], "postprocess": function arrpush(d: any) {return d[0].concat([d[1]]);}},
    {"name": "BlockStatements", "symbols": ["_", "BlockStatements$ebnf$1", "_"], "postprocess": ([, statements]: any[]) => statements.filter((s: any) => s !== null)},
    {"name": "FunctionDecl", "symbols": ["lowkey", "_", "identifier", "_", "lparen", "_", "Parameters", "_", "rparen", "_", "Statement"], "postprocess": ([,, name,,,, params,,,, body]: any[]) => ({ type: 'FunctionDeclaration', name: name.value, params, body })},
    {"name": "Parameters$ebnf$1", "symbols": []},
    {"name": "Parameters$ebnf$1", "symbols": ["Parameters$ebnf$1", "ParameterTail"], "postprocess": function arrpush(d: any) {return d[0].concat([d[1]]);}},
    {"name": "Parameters", "symbols": ["identifier", "Parameters$ebnf$1"], "postprocess": ([first, rest]: any[]) => [first.value, ...rest]},
    {"name": "Parameters", "symbols": [], "postprocess": () => []},
    {"name": "ParameterTail", "symbols": ["_", "comma", "_", "identifier"], "postprocess": ([,,, param]: any[]) => param.value},
    {"name": "ExprStatement", "symbols": ["Expression", "_", "semicolon"], "postprocess": ([expr]: any[]) => ({ type: 'ExpressionStatement', expression: expr })},
    {"name": "Expression", "symbols": ["Assignment"], "postprocess": id},
    {"name": "Expression", "symbols": ["Assignment"], "postprocess": id},
    {"name": "Expression", "symbols": ["BinaryExpression"], "postprocess": id},
    {"name": "Assignment", "symbols": ["identifier", "_", "assign", "_", "Expression"], "postprocess": 
        (data: any[]) => {
          const id = data[0];
          const expr = data[4];
          return {
            type: 'BinaryExpression',
            operator: 'assign',
            left: { type: 'Identifier', name: id.value },
            right: expr
          };
        }
    },
    {"name": "Assignment", "symbols": ["identifier", "_", "assign", "_", "Expression"], "postprocess": 
        ([id, , , , expr]: any[]) => ({
          type: 'BinaryExpression',
          operator: 'assign',
          left: { type: 'Identifier', name: id.value },
          right: expr
        })
    },
    {"name": "BinaryExpression", "symbols": ["ComparisonExpression"], "postprocess": id},
    {"name": "ComparisonExpression", "symbols": ["ArithmeticExpression"], "postprocess": id},
    {"name": "ComparisonExpression", "symbols": ["ComparisonExpression", "_", "eq", "_", "ArithmeticExpression"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'eq', left, right })},
    {"name": "ComparisonExpression", "symbols": ["ComparisonExpression", "_", "neq", "_", "ArithmeticExpression"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'neq', left, right })},
    {"name": "ComparisonExpression", "symbols": ["ComparisonExpression", "_", "lt", "_", "ArithmeticExpression"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'lt', left, right })},
    {"name": "ComparisonExpression", "symbols": ["ComparisonExpression", "_", "gt", "_", "ArithmeticExpression"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'gt', left, right })},
    {"name": "ComparisonExpression", "symbols": ["ComparisonExpression", "_", "lteq", "_", "ArithmeticExpression"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'lteq', left, right })},
    {"name": "ComparisonExpression", "symbols": ["ComparisonExpression", "_", "gteq", "_", "ArithmeticExpression"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'gteq', left, right })},
    {"name": "ArithmeticExpression", "symbols": ["Term"], "postprocess": id},
    {"name": "ArithmeticExpression", "symbols": ["ArithmeticExpression", "_", "bop", "_", "Term"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'add', left, right })},
    {"name": "ArithmeticExpression", "symbols": ["ArithmeticExpression", "_", "skrt", "_", "Term"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'sub', left, right })},
    {"name": "Term", "symbols": ["Factor"], "postprocess": id},
    {"name": "Term", "symbols": ["Term", "_", "flex", "_", "Factor"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'mul', left, right })},
    {"name": "Term", "symbols": ["Term", "_", "yikes", "_", "Factor"], "postprocess": ([left,,,, right]: any[]) => ({ type: 'BinaryExpression', operator: 'div', left, right })},
    {"name": "Factor", "symbols": ["PrimaryExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["number"], "postprocess": ([token]: any[]) => ({ type: 'Literal', value: parseFloat(token.value) })},
    {"name": "PrimaryExpression", "symbols": ["string"], "postprocess": ([token]: any[]) => ({ type: 'Literal', value: token.value.slice(1, -1) })},
    {"name": "PrimaryExpression", "symbols": ["bet"], "postprocess": () => ({ type: 'BooleanLiteral', value: true })},
    {"name": "PrimaryExpression", "symbols": ["cap"], "postprocess": () => ({ type: 'BooleanLiteral', value: false })},
    {"name": "PrimaryExpression", "symbols": ["identifier"], "postprocess": ([token]: any[]) => ({ type: 'Identifier', name: token.value })},
    {"name": "PrimaryExpression", "symbols": ["FunctionCall"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["lparen", "_", "Expression", "_", "rparen"], "postprocess": ([,, expr]: any[]) => expr},
    {"name": "FunctionCall", "symbols": ["identifier", "_", "lparen", "_", "Arguments", "_", "rparen"], "postprocess": ([name,,,, args]: any[]) => ({ type: 'CallExpression', callee: { type: 'Identifier', name: name.value }, arguments: args })},
    {"name": "Arguments$ebnf$1", "symbols": []},
    {"name": "Arguments$ebnf$1", "symbols": ["Arguments$ebnf$1", "ArgumentTail"], "postprocess": function arrpush(d: any) {return d[0].concat([d[1]]);}},
    {"name": "Arguments", "symbols": ["Expression", "Arguments$ebnf$1"], "postprocess": ([expr, rest]: any[]) => [expr, ...rest]},
    {"name": "Arguments", "symbols": [], "postprocess": () => []},
    {"name": "ArgumentTail", "symbols": ["_", "comma", "_", "Expression"], "postprocess": ([,,, expr]: any[]) => expr},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d: any) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d: any) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\r]/], "postprocess": function(d: any) {return null;}},
    {"name": "yeet", "symbols": [(lexer as any).has("yeet") ? {type: "yeet"} : "yeet"], "postprocess": id},
    {"name": "sus", "symbols": [(lexer as any).has("sus") ? {type: "sus"} : "sus"], "postprocess": id},
    {"name": "bet", "symbols": [(lexer as any).has("bet") ? {type: "bet"} : "bet"], "postprocess": id},
    {"name": "cap", "symbols": [(lexer as any).has("cap") ? {type: "cap"} : "cap"], "postprocess": id},
    {"name": "tea", "symbols": [(lexer as any).has("tea") ? {type: "tea"} : "tea"], "postprocess": id},
    {"name": "lowkey", "symbols": [(lexer as any).has("lowkey") ? {type: "lowkey"} : "lowkey"], "postprocess": id},
    {"name": "vibe", "symbols": [(lexer as any).has("vibe") ? {type: "vibe"} : "vibe"], "postprocess": id},
    {"name": "fr", "symbols": [(lexer as any).has("fr") ? {type: "fr"} : "fr"], "postprocess": id},
    {"name": "bop", "symbols": [(lexer as any).has("bop") ? {type: "bop"} : "bop"], "postprocess": id},
    {"name": "skrt", "symbols": [(lexer as any).has("skrt") ? {type: "skrt"} : "skrt"], "postprocess": id},
    {"name": "flex", "symbols": [(lexer as any).has("flex") ? {type: "flex"} : "flex"], "postprocess": id},
    {"name": "yikes", "symbols": [(lexer as any).has("yikes") ? {type: "yikes"} : "yikes"], "postprocess": id},
    {"name": "else", "symbols": [(lexer as any).has("else") ? {type: "else"} : "else"], "postprocess": id},
    {"name": "lparen", "symbols": [(lexer as any).has("lparen") ? {type: "lparen"} : "lparen"], "postprocess": id},
    {"name": "rparen", "symbols": [(lexer as any).has("rparen") ? {type: "rparen"} : "rparen"], "postprocess": id},
    {"name": "lbrace", "symbols": [(lexer as any).has("lbrace") ? {type: "lbrace"} : "lbrace"], "postprocess": id},
    {"name": "rbrace", "symbols": [(lexer as any).has("rbrace") ? {type: "rbrace"} : "rbrace"], "postprocess": id},
    {"name": "semicolon", "symbols": [(lexer as any).has("semicolon") ? {type: "semicolon"} : "semicolon"], "postprocess": id},
    {"name": "comma", "symbols": [(lexer as any).has("comma") ? {type: "comma"} : "comma"], "postprocess": id},
    {"name": "assign", "symbols": [(lexer as any).has("assign") ? {type: "assign"} : "assign"], "postprocess": id},
    {"name": "eq", "symbols": [(lexer as any).has("eq") ? {type: "eq"} : "eq"], "postprocess": id},
    {"name": "neq", "symbols": [(lexer as any).has("neq") ? {type: "neq"} : "neq"], "postprocess": id},
    {"name": "lt", "symbols": [(lexer as any).has("lt") ? {type: "lt"} : "lt"], "postprocess": id},
    {"name": "gt", "symbols": [(lexer as any).has("gt") ? {type: "gt"} : "gt"], "postprocess": id},
    {"name": "lteq", "symbols": [(lexer as any).has("lteq") ? {type: "lteq"} : "lteq"], "postprocess": id},
    {"name": "gteq", "symbols": [(lexer as any).has("gteq") ? {type: "gteq"} : "gteq"], "postprocess": id},
    {"name": "number", "symbols": [(lexer as any).has("number") ? {type: "number"} : "number"], "postprocess": id},
    {"name": "string", "symbols": [(lexer as any).has("string") ? {type: "string"} : "string"], "postprocess": id},
    {"name": "identifier", "symbols": [(lexer as any).has("identifier") ? {type: "identifier"} : "identifier"], "postprocess": id}
]
    , ParserStart: "Program"
};

export default grammar;
