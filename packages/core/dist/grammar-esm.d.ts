declare function id(x: any): any;
declare const grammar: {
    Lexer: import("moo").Lexer;
    ParserRules: ({
        name: string;
        symbols: never[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: string[];
        postprocess: (d: any[]) => any;
    } | {
        name: string;
        symbols: RegExp[];
        postprocess: (d: any[]) => null;
    } | {
        name: string;
        symbols: (string | {
            type: string;
        })[];
        postprocess: typeof id;
    })[];
    ParserStart: string;
};
export default grammar;
