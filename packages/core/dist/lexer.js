// src/lexer.ts
import moo from 'moo';
// Define token types for better TypeScript support
export const tokenTypes = {
    yeet: 'yeet',
    sus: 'sus',
    cap: 'cap',
    bet: 'bet',
    tea: 'tea',
    lowkey: 'lowkey',
    vibe: 'vibe',
    fr: 'fr',
    no_cap: 'no_cap',
    slay: 'slay',
    bop: 'bop',
    skrt: 'skrt',
    spill: 'spill',
    else: 'else',
    flex: 'flex', // Multiplication
    yikes: 'yikes', // Division
    lparen: 'lparen',
    rparen: 'rparen',
    lbrace: 'lbrace',
    rbrace: 'rbrace',
    lbracket: 'lbracket',
    rbracket: 'rbracket',
    semicolon: 'semicolon',
    comma: 'comma',
    eq: 'eq',
    assign: 'assign',
    gt: 'gt',
    lt: 'lt',
    gteq: 'gteq',
    lteq: 'lteq',
    neq: 'neq',
    number: 'number',
    string: 'string',
    identifier: 'identifier',
    ws: 'ws',
    comment: 'comment',
};
// Create the lexer
const lexer = moo.compile({
    // Comments (must come before keywords to correctly identify "spill" as a comment starter)
    comment: { match: /\/\/.*?$|[Ss][Pp][Ii][Ll][Ll]\s+.*?$/, lineBreaks: true }, // Comments - Note: "spill" followed by whitespace is a comment
    // Keywords
    yeet: /[Yy][Ee][Ee][Tt]\b/,
    sus: /[Ss][Uu][Ss]\b/,
    bet: /[Bb][Ee][Tt]\b/,
    cap: /[Cc][Aa][Pp]\b/,
    tea: /[Tt][Ee][Aa]\b/,
    lowkey: /[Ll][Oo][Ww][Kk][Ee][Yy]\b/,
    vibe: /[Vv][Ii][Bb][Ee]\b/,
    fr: /[Ff][Rr]\b/,
    no_cap: /[Nn][Oo]_[Cc][Aa][Pp]\b/,
    slay: /[Ss][Ll][Aa][Yy]\b/,
    else: /[Ee][Ll][Ss][Ee]\b/,
    spill: /[Ss][Pp][Ii][Ll][Ll]\b/,
    // Operators
    bop: /[Bb][Oo][Pp]\b/, // Addition
    skrt: /[Ss][Kk][Rr][Tt]\b/, // Subtraction
    flex: /[Ff][Ll][Ee][Xx]\b/, // Multiplication
    yikes: /[Yy][Ii][Kk][Ee][Ss]\b/, // Division
    // Punctuation
    lparen: '(',
    rparen: ')',
    lbrace: '{',
    rbrace: '}',
    lbracket: '[',
    rbracket: ']',
    semicolon: ';',
    comma: ',',
    // Operators (non-slang)
    eq: '==',
    assign: '=',
    gteq: '>=', // Order matters! Must come before gt
    lteq: '<=', // Order matters! Must come before lt
    gt: '>',
    lt: '<',
    neq: '!=',
    // Literals
    number: /[0-9]+(?:\.[0-9]+)?/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
    // Identifiers
    identifier: /[a-zA-Z_][a-zA-Z0-9_]*/,
    // Whitespace
    ws: { match: /[ \t\n\r]+/, lineBreaks: true } // Whitespace
});
export default lexer;
// Tell moo to skip whitespace and comments
const originalNext = lexer.next;
lexer.next = function () {
    let token;
    do {
        token = originalNext.call(this);
    } while (token && (token.type === 'ws' || token.type === 'comment'));
    return token;
};
//# sourceMappingURL=lexer.js.map