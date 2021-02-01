import tsv from "tsv";
// import { error } from "./../logger";

/**
 * @name parse
 * @param text
 * @param reviver
 */
const parse = (text: string, reviver?: (this: any, key: string, value: any) => any): any => {
    try {
        return tsv.CSV.parse(text, reviver);
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
const stringify = (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string => {
    try {
        return tsv.CSV.stringify(value, replacer, space);
    } catch (e) {
        console.error("TSV.stringify:error", e);
    }
    return null;
};

export const csv = {parse, stringify};
