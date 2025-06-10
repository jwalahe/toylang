declare function id(x: any): any;
declare const grammar: {
    Lexer: any;
    ParserRules: ({
        name: string;
        symbols: never[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: (string | {
            type: string;
        })[];
        postprocess: ([, , , , condition, , , , then, , , , else_]: any[]) => {
            type: string;
            condition: any;
            thenBranch: any;
            elseBranch: any;
        };
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
    ParserStart: string;
};
export default grammar;
