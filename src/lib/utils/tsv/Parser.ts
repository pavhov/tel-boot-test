import tsvParser from "tsv";
// import { error } from "./../logger";

export namespace csv {
    /**
     * @name parse
     * @param text
     * @param reviver
     */
    export const parse = (text: string, reviver?: (this: any, key: string, value: any) => any): any => {
        try {
            return tsvParser.CSV.parse(text, reviver);
        } catch (e) {
            console.error("TSV.parse:error", e);
        }
        return null;
    };

    /**
     * @name stringify
     * @param value
     * @param replacer
     * @param space
     */
    export const stringify = (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string => {
        try {
            return tsvParser.CSV.stringify(value, replacer, space);
        } catch (e) {
            console.error("TSV.stringify:error", e);
        }
        return null;
    };
}

export namespace tsv {
    /**
     * @name parse
     * @param text
     * @param reviver
     */
    export const parse = (text: string, reviver?: (this: any, key: string, value: any) => any): any => {
        try {
            return tsvParser.TSV.parse(text, reviver);
        } catch (e) {
            console.error("TSV.parse:error", e);
        }
        return null;
    };

    /**
     * @name stringify
     * @param value
     * @param replacer
     * @param space
     */
    export const stringify = (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string => {
        try {
            return tsvParser.TSV.stringify(value, replacer, space);
        } catch (e) {
            console.error("TSV.stringify:error", e);
        }
        return null;
    };
}
