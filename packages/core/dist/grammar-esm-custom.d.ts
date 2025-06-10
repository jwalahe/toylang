declare function id(x: any): any;
declare const grammar: {
    Lexer: import("moo").Lexer;
    ParserStart: string;
    ParserRules: ({
        name: string;
        symbols: never[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: string[];
        postprocess: ([, statements]: any[]) => any;
    } | {
        name: string;
        symbols: RegExp[];
        postprocess: (d: any) => null;
    } | {
        name: string;
        symbols: (string | {
            type: string;
        })[];
        postprocess: typeof id;
    })[];
};
export default grammar;
