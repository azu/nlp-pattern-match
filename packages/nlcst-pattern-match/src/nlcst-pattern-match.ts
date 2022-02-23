// MIT © 2017 azu
import { isParagraph, isPunctuation, isSentence, isWhiteSpace, Root } from "nlcst-types";
import { Node, Parent } from "unist-types";
import { PatternNode, TagNode } from "./NodeTypes";
import { match, MatchCSTResult, MatchResult } from "./matcher";

const walk = require("estree-walker").walk;
// Acceptable Node Types
export type NodeTypes = TagNode | PatternNode | Node;

export interface PatternMatcherArgs {
    parser: { parse(text: string): Root };
}

/**
 * tag function result
 */
export type TagPatterns = NodeTypes[];

export class PatternMatcher {
    private parser: { parse: (text: string) => Root };

    constructor(args: PatternMatcherArgs) {
        this.parser = args.parser;
    }

    /**
     * Return true If test is passed
     */
    test(text: string, patterns: TagPatterns): boolean {
        return this.match(text, patterns).length !== 0;
    }

    match(text: string, patterns: TagPatterns): MatchResult[] {
        if (typeof text !== "string") {
            throw new Error(
                "Invalid Arguments: match(text: string, pattern: TagPattern)\n" +
                    "matcher.match(text, matcher.tag`pattern`)"
            );
        }
        const CST = this.parser.parse(text);
        const CSTResults = this.matchCST(CST, patterns);
        return CSTResults.map((node) => {
            const firstNode = node.nodeList[0];
            const lastNode = node.nodeList[node.nodeList.length - 1];
            if (!firstNode || !lastNode) {
                return {
                    text: "",
                    position: node.position,
                    nodeList: node.nodeList
                };
            }
            return {
                text: text.slice(firstNode.position!.start.offset, lastNode.position!.end.offset),
                position: node.position,
                nodeList: node.nodeList
            };
        });
    }

    testCST(cst: Root, patterns: TagPatterns): boolean {
        return this.matchCST(cst, patterns).length > 0;
    }

    matchCST(cst: Root, patterns: TagPatterns): MatchCSTResult[] {
        let allResults: MatchCSTResult[] = [];
        walk(cst, {
            enter: function (node: Node) {
                if (isSentence(node)) {
                    const results = match(node.children, patterns);
                    allResults = allResults.concat(results);
                    this.skip();
                }
            }
        });
        return allResults;
    }

    /**
     * Template tag function.
     * Return pattern objects that are used for `matcher.match` method.
     */
    tag(strings: TemplateStringsArray, ...values: NodeTypes[]): TagPatterns {
        if (!Array.isArray(strings)) {
            throw new Error(
                "tag method is template tag function.\n" + 'For example matcher.tag`this is ${{ type: "WordNode" }}` .'
            );
        }
        const replaceHolders: { start: number; length: number; value: NodeTypes }[] = [];
        const createPlaceholder = (result: string, value: TagNode) => {
            const DEFAULT_VALUE_LENGTH = 5;
            const length = value.length ? value.length : DEFAULT_VALUE_LENGTH;
            replaceHolders.push({
                start: result.length,
                length: length,
                value
            });
            if (isPunctuation(value)) {
                return new Array(length + 1).join(".");
            } else if (isWhiteSpace(value)) {
                return new Array(length + 1).join(" ");
            } else {
                const lastCharacter = result[result.length - 1];
                if (!lastCharacter) {
                    // other is Symbol
                    return new Array(length + 1).join("|");
                }
                if (lastCharacter === " ") {
                    return new Array(length + 1).join("|");
                } else if (lastCharacter === "|") {
                    return new Array(length + 1).join(" ");
                } else {
                    return new Array(length + 1).join("|");
                }
            }
        };
        const allString = strings.reduce((result, string, i) => {
            const valueIndex = i - 1;
            const value = values[valueIndex];
            return `${result}${createPlaceholder(result, value)}${string}`;
        });
        const AST = this.parser.parse(allString);
        walk(AST, {
            enter: function (node: Node, parent: Parent) {
                if (!parent || !parent.children) {
                    return;
                }
                if (isParagraph(node) || isSentence(node)) {
                    return;
                }
                replaceHolders
                    .filter((replaceHolder) => {
                        return (
                            node.position!.start.offset === replaceHolder.start &&
                            node.position!.end.offset === replaceHolder.start + replaceHolder.length
                        );
                    })
                    .forEach((replaceHolder) => {
                        const indexOf = parent.children.indexOf(node);
                        const actualNode = parent.children[indexOf];
                        const placeholderNode = replaceHolder.value;
                        parent.children[indexOf] = Object.assign({}, placeholderNode, {
                            position: actualNode.position
                        });
                    });
            }
        });

        const section = AST.children[0].children[0];
        return section.children as TagPatterns;
    }
}
