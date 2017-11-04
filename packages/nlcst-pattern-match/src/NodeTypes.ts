// MIT © 2017 azu
import { Node } from "unist-types";

export interface TagNode extends Node {
    length?: number;
    isNegative?: boolean;
}

export const isPatternNode = (v: any): v is PatternNode => {
    return v.type === "PatternNode";
};

export interface PatternNode extends Node {
    type: "PatternNode";
    pattern: RegExp;
}
