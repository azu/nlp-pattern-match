// MIT © 2017 azu
import { Root } from "nlcst-types";
import { Parent, Node, Position } from "unist-types";
import { isPunctuation, isSentence, isWhiteSpace, Sentence, Word, Punctuation, WhiteSpace } from "nlcst-types";

const select = require("unist-util-select");
const walk = require("estree-walker").walk;
const isRegExp = (v: any): v is RegExp => {
    return Object.prototype.toString.call(v) === "[object RegExp]";
};

export interface PatternMatcherArgs {
    parser: { parse(text: string): Root };
}

function matchNode(actualNode: Node, expectedNode: Node): boolean {
    return ["type", "children", "value", "data"].every((key: string) => {
        const expectedProp = expectedNode[key];
        if (!expectedProp) {
            return true;
        }
        const actualProp = actualNode[key];
        if (key === "children") {
            return expectedProp.every((expectedChildNode: Node, index: number) => {
                const actualChildNode = actualProp[index];
                return matchNode(actualChildNode, expectedChildNode);
            });
        } else {
            const expectedValues = Array.isArray(expectedProp) ? expectedProp : [expectedProp];
            return expectedValues.some(expectedValue => {
                if (isRegExp(expectedValue)) {
                    return expectedValue.test(actualProp);
                } else if (typeof expectedValue === "object") {
                    // data object
                    return Object.keys(expectedValue).every(key => {
                        return expectedValue[key] === actualProp[key];
                    });
                } else {
                    return actualProp === expectedValue;
                }
            });
        }
    });
}

function match(parent: Sentence, expectedNode: Sentence) {
    if (!isSentence(parent)) {
        throw new Error(`Expected sentence node: ${JSON.stringify(parent)}`);
    }
    if (!isSentence(expectedNode)) {
        throw new Error(`Expected sentence node: ${JSON.stringify(expectedNode)}`);
    }
    const children = parent.children;
    const expectedChildren = expectedNode.children;
    const tokenCount = expectedChildren.length;
    const matchTokens = [];
    const results: { position: Position | undefined; nodeList: Node[] }[] = [];
    let currentTokenPosition = 0;
    let index = 0;
    for (index = 0; index < children.length; index++) {
        const actualChild = children[index];
        const expectedChild = expectedChildren[currentTokenPosition];
        if (matchNode(actualChild, expectedChild)) {
            matchTokens.push(actualChild);
            currentTokenPosition += 1;
        } else {
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
            results.push({
                position:
                    firstNode.position && lastNode.position
                        ? {
                              start: firstNode.position.start,
                              end: lastNode.position.end,
                              index: firstNode.index
                          }
                        : undefined,
                nodeList: tokens
            });
        }
    }
    return results;
}

export interface TagNode extends Node {
    length?: number;
}

export class PatternMatcher {
    private parser: { parse: ((text: string) => Root) };

    constructor(args: PatternMatcherArgs) {
        this.parser = args.parser;
    }

    match(text: string, pattern: any) {
        let allResults: { position: Position | undefined; nodeList: Node[] }[] = [];
        const AST = this.parser.parse(text);
        walk(AST, {
            enter: function(node: Node) {
                if (isSentence(node)) {
                    const results = match(node, pattern);
                    allResults = allResults.concat(results);
                    this.skip();
                }
            }
        });
        return allResults;
    }

    createWordNode(text: string): Word {
        const AST = this.parser.parse(text);
        return select.one(AST, "WordNode");
    }

    createPunctuationNode(text: string): Punctuation {
        return {
            type: "PunctuationNode",
            value: text
        };
    }

    createWhitespaceNode(length: number): WhiteSpace {
        return {
            type: "WhiteSpaceNode",
            value: new Array(length + 1).join(" ")
        };
    }

    tag(strings: TemplateStringsArray, ...values: TagNode[]): Sentence {
        const replaceHolders: { start: number; length: number; value: TagNode }[] = [];
        const createPlaceholder = (start: number, value: TagNode) => {
            const DEFAULT_VALUE_LENGTH = 5;
            const length = value.length ? value.length : DEFAULT_VALUE_LENGTH;
            replaceHolders.push({
                start,
                length: length,
                value
            });
            if (isPunctuation(value)) {
                return new Array(length + 1).join(".");
            } else if (isWhiteSpace(value)) {
                return new Array(length + 1).join(" ");
            } else {
                return new Array(length + 1).join("X");
            }
        };
        const allString = strings.reduce((result, string, i) => {
            const valueIndex = i - 1;
            const value = values[valueIndex];
            return `${result}${createPlaceholder(result.length, value)}${string}`;
        });
        const AST = this.parser.parse(allString);
        walk(AST, {
            enter: function(node: Node, parent: Parent) {
                replaceHolders
                    .filter(replaceHolder => {
                        return node.position!.start.offset === replaceHolder.start;
                    })
                    .forEach(replaceHolder => {
                        const indexOf = parent.children.indexOf(node);
                        const actualNode = parent.children[indexOf];
                        const placeholderNode = replaceHolder.value;
                        parent.children[indexOf] = Object.assign({}, placeholderNode, {
                            position: actualNode.position
                        });
                    });
            }
        });

        return AST.children[0].children[0] as Sentence;
    }
}
