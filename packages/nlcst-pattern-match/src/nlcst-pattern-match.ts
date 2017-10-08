// MIT © 2017 azu
import { Root } from "nlcst-types";
import { Parent, Node } from "unist-types";
import { isPunctuation, isSentence, isWhiteSpace, Sentence } from "nlcst-types";
import { PatternNode, TagNode } from "./NodeTypes";
import { match, MatchResult } from "./matcher";

const walk = require("estree-walker").walk;
// Acceptable Node Types
export type NodeTypes = TagNode | PatternNode | Node;

export interface PatternMatcherArgs {
    parser: { parse(text: string): Root };
}

export class PatternMatcher {
    private parser: { parse: ((text: string) => Root) };

    constructor(args: PatternMatcherArgs) {
        this.parser = args.parser;
    }

    /**
     * Return true If test is passed
     */
    test(text: string, pattern: Sentence): boolean {
        return this.match(text, pattern).length !== 0;
    }

    match(text: string, pattern: Sentence): MatchResult[] {
        if (typeof text !== "string") {
            throw new Error(
                "Invalid Arguments: match(text: string, pattern: Sentence)\n" +
                    "matcher.match(text, matcher.tag`pattern`)"
            );
        }
        let allResults: MatchResult[] = [];
        const AST = this.parser.parse(text);
        walk(AST, {
            enter: function(node: Node) {
                if (isSentence(node)) {
                    const results = match(text, node, pattern);
                    allResults = allResults.concat(results);
                    this.skip();
                }
            }
        });
        return allResults;
    }

    // createPatternNode(pattern: RegExp): PatternNode {
    //     return {
    //         type: "PatternNode",
    //         pattern
    //     };
    // }
    //
    // createWordNode(text: string): Word {
    //     const AST = this.parser.parse(text);
    //     return select.one(AST, "WordNode");
    // }
    //
    // createPunctuationNode(text: string): Punctuation {
    //     return {
    //         type: "PunctuationNode",
    //         value: text
    //     };
    // }
    //
    // createWhitespaceNode(length: number): WhiteSpace {
    //     return {
    //         type: "WhiteSpaceNode",
    //         value: new Array(length + 1).join(" ")
    //     };
    // }

    /**
     * Template tag function.
     * Return pattern objects that are used for `matcher.match` method.
     */
    tag(strings: TemplateStringsArray, ...values: NodeTypes[]): Sentence {
        if (!Array.isArray(strings)) {
            throw new Error(
                "tag method is template tag function.\n" + 'For example matcher.tag`this is ${{ type: "WordNode" }}` .'
            );
        }
        const replaceHolders: { start: number; length: number; value: NodeTypes }[] = [];
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
