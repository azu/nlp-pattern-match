// MIT © 2017 azu
import { isPatternNode, TagNode } from "./NodeTypes";
import { Node, Position } from "unist-types";

const debug = require("debug")("nlcst-pattern-match");
const toString = require("nlcst-to-string");
import { TagPatterns } from "./nlcst-pattern-match";

export const isRegExp = (v: any): v is RegExp => {
    return Object.prototype.toString.call(v) === "[object RegExp]";
};

export interface MatchResult {
    text: string;
    position: Position | undefined;
    nodeList: Node[];
}

export interface MatchCSTResult {
    position: Position | undefined;
    nodeList: Node[];
}

/**
 * Match actualValue with expectedValue
 * @param actualValue
 * @param expectedValue
 * @returns {boolean}
 */
export function matchValue(actualValue: any, expectedValue: any): boolean {
    if (actualValue === undefined || expectedValue === undefined) {
        return false;
    }
    // wildcard
    if (expectedValue === "*" && actualValue !== undefined) {
        return true;
    } else if (isRegExp(expectedValue)) {
        // /pattern/
        return expectedValue.test(actualValue);
    } else if (Array.isArray(expectedValue)) {
        // value: ["a", "b"]
        return expectedValue.some((value) => {
            return matchValue(actualValue, value);
        });
    } else if (typeof expectedValue === "object") {
        // data object
        return Object.keys(expectedValue).every((key) => {
            return matchValue(actualValue[key], expectedValue[key]);
        });
    }
    return actualValue === expectedValue;
}

/**
 * Match actualNode with expectedNode
 * @param {Node} actualNode
 * @param {TagNode} expectedNode
 * @returns {boolean}
 */
export function matchNode(actualNode: Node, expectedNode: TagNode): boolean {
    // ignore other property. ore-ore property should be ignored
    const isMatch = ["type", "children", "value", "data"].every((key: string) => {
        const expectedProp = expectedNode[key];
        if (!expectedProp) {
            return true;
        }
        const actualProp = actualNode[key];
        debug(`Math: ${key}: `, expectedProp, actualProp);
        if (key === "children") {
            const every = expectedProp.every((expectedChildNode: Node, index: number) => {
                const actualChildNode = actualProp[index];
                return matchNode(actualChildNode, expectedChildNode);
            });
            debug("RETURN:CIL", every);
            return every;
        } else {
            const expectedValues = Array.isArray(expectedProp) ? expectedProp : [expectedProp];
            let b = expectedValues.some((expectedValue) => {
                return matchValue(actualProp, expectedValue);
            });
            debug("RETURN", b);
            return b;
        }
    });
    if (typeof expectedNode.isNegative === "boolean" && expectedNode.isNegative) {
        return !isMatch;
    }
    return isMatch;
}

/**
 * match actualNodes with expectedPatterns
 * @param {Sentence} actualNodes
 * @param {Sentence} expectedPatterns
 * @returns {MatchCSTResult[]}
 */
export function match(actualNodes: Node[], expectedPatterns: TagPatterns): MatchCSTResult[] {
    const expectedChildren = expectedPatterns;
    const tokenCount = expectedChildren.length;
    const matchTokens: Node[] = [];
    const results: MatchCSTResult[] = [];
    let currentTokenPosition = 0;
    let index = 0;
    for (index = 0; index < actualNodes.length; index++) {
        const actualChild = actualNodes[index];
        const expectedChild = expectedChildren[currentTokenPosition];
        // PatternNode
        if (isPatternNode(expectedChild)) {
            const pattern = expectedChild.pattern;
            const afterAllChildren = actualNodes.slice(index);
            const startIndex = afterAllChildren[0].position!.start.offset!;
            const text = toString(afterAllChildren);
            const matchResult = text.match(pattern);
            if (matchResult) {
                const progressLength = matchResult[0].length;
                const endIndex = startIndex + progressLength;
                const restChildren = afterAllChildren.slice(1);
                // fist token always added because already matchResult.
                matchTokens.push(afterAllChildren[0]);
                restChildren.forEach((restChild) => {
                    const nodeOffset = restChild.position!.end.offset!;
                    if (startIndex <= nodeOffset && nodeOffset <= endIndex) {
                        matchTokens.push(restChild);
                        index++;
                    }
                });
                currentTokenPosition += 1;
            } else {
                // reset position
                matchTokens.length = 0;
                currentTokenPosition = 0;
            }
        } else if (matchNode(actualChild, expectedChild)) {
            matchTokens.push(actualChild);
            currentTokenPosition += 1;
        } else {
            debug("FAIL", expectedChild);
            // reset position
            matchTokens.length = 0;
            currentTokenPosition = 0;
        }
        // match all tokens
        if (currentTokenPosition === tokenCount) {
            const tokens = matchTokens.slice();
            if (tokens.length === 0) {
                continue;
            }
            // match -> reset
            currentTokenPosition = 0;
            matchTokens.length = 0;
            const firstNode = tokens[0];
            const lastNode = tokens[tokens.length - 1];
            if (!firstNode.position) {
                throw new Error(`The node has not position: ${firstNode}`);
            }
            if (!lastNode.position) {
                throw new Error(`The node has not position: ${firstNode}`);
            }
            results.push({
                position: {
                    start: firstNode.position.start,
                    end: lastNode.position.end,
                    index: firstNode.position.start.offset
                },
                nodeList: tokens
            });
        }
    }
    return results;
}
