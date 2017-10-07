import { PatternMatcher } from "../src/nlcst-pattern-match";
import * as assert from "assert";

import { isWord } from "nlcst-types";
import { EnglishParser } from "nlcst-parse-english";

// const inspect = require('unist-util-inspect');

describe("nlcst-pattern-match", () => {
    it("parse", () => {
        const englishParser = new EnglishParser();
        const patternMatcher = new PatternMatcher({
            parser: englishParser
        });
        assert.ok(patternMatcher instanceof PatternMatcher);
    });
    describe("createWordNode", () => {
        it("should return wordNode", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const word = patternMatcher.createWordNode("text");
            assert.ok(isWord(word), "should return wordNode");
        });
    });
    it("parse-replace", () => {
        const englishParser = new EnglishParser();
        const patternMatcher = new PatternMatcher({
            parser: englishParser
        });
        const actual = patternMatcher.tag`This is ${{
            type: "WordNode"
        }}.`;
        assert.deepEqual(
            actual,
            {
                type: "SentenceNode",
                children: [
                    {
                        type: "WordNode",
                        children: [
                            {
                                type: "TextNode",
                                value: "This",
                                position: {
                                    start: { line: 1, column: 1, offset: 0 },
                                    end: { line: 1, column: 5, offset: 4 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 1, offset: 0 },
                            end: { line: 1, column: 5, offset: 4 }
                        },
                        data: { pos: "DT" }
                    },
                    {
                        type: "WhiteSpaceNode",
                        value: " ",
                        position: {
                            start: { line: 1, column: 5, offset: 4 },
                            end: { line: 1, column: 6, offset: 5 }
                        }
                    },
                    {
                        type: "WordNode",
                        children: [
                            {
                                type: "TextNode",
                                value: "is",
                                position: {
                                    start: { line: 1, column: 6, offset: 5 },
                                    end: { line: 1, column: 8, offset: 7 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 6, offset: 5 },
                            end: { line: 1, column: 8, offset: 7 }
                        },
                        data: { pos: "VBZ" }
                    },
                    {
                        type: "WhiteSpaceNode",
                        value: " ",
                        position: {
                            start: { line: 1, column: 8, offset: 7 },
                            end: { line: 1, column: 9, offset: 8 }
                        }
                    },
                    {
                        type: "WordNode",
                        position: {
                            start: { line: 1, column: 9, offset: 8 },
                            end: { line: 1, column: 14, offset: 13 }
                        }
                    },
                    {
                        type: "PunctuationNode",
                        value: ".",
                        position: {
                            start: { line: 1, column: 14, offset: 13 },
                            end: { line: 1, column: 15, offset: 14 }
                        },
                        data: { pos: "." }
                    }
                ],
                position: {
                    start: { line: 1, column: 1, offset: 0 },
                    end: { line: 1, column: 15, offset: 14 }
                }
            },
            `Mismatch
${JSON.stringify(actual)}
`
        );
    });

    describe("#match", () => {
        it("match regexp", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            let pattern = patternMatcher.tag`This is a ${{
                type: "WordNode",
                children: [
                    {
                        type: "TextNode",
                        value: /\w+/
                    }
                ]
            }}.`;
            let text = "Hello, This is a pen.";
            const results = patternMatcher.match(text, pattern);
            const result = results[0];

            assert.strictEqual(
                text.slice(result.position!.start.offset, result.position!.end.offset),
                "This is a pen."
            );
        });
        it("WordNode", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            let pattern = patternMatcher.tag`This is a ${{
                type: "WordNode",
                length: 3
            }}.`;
            let text = "Hello, This is a pen.";
            const results = patternMatcher.match(text, pattern);
            const result = results[0];

            assert.strictEqual(
                text.slice(result.position!.start.offset, result.position!.end.offset),
                "This is a pen."
            );
        });
        it("WordNode + PunctuationNode", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`This is a ${{
                type: "WordNode",
                length: 3,
                children: [
                    {
                        type: "TextNode",
                        value: "pen"
                    }
                ]
            }}${{
                type: "PunctuationNode"
            }}`;
            const text = "Hello, This is a pen.";
            const results = patternMatcher.match(text, pattern);
            assert.ok(results.length === 1, "should have 1 result");
            const result = results[0];
            assert.strictEqual(
                text.slice(result.position!.start.offset, result.position!.end.offset),
                "This is a pen."
            );
        });
        it("WordNode(NN)", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`This is a ${{
                type: "*",
                data: {
                    pos: "NN"
                }
            }}.`;
            const text = "Hello, This is a pen.";
            const results = patternMatcher.match(text, pattern);
            assert.ok(results.length === 1, "should have 1 result");
            const result = results[0];
            console.log("result", result);
            assert.strictEqual(
                text.slice(result.position!.start.offset, result.position!.end.offset),
                "This is a pen."
            );
        });
        it("WordNode(/^NN/)", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`These are ${{
                type: "*",
                data: {
                    pos: /^NN/
                }
            }}.`;
            const text = "These are cars. Cool!";
            const results = patternMatcher.match(text, pattern);
            assert.ok(results.length === 1, "should have 1 result");
            const result = results[0];
            assert.strictEqual(
                text.slice(result.position!.start.offset, result.position!.end.offset),
                "These are cars."
            );
        });
    });
});
