import { PatternMatcher } from "../src/nlcst-pattern-match";
import * as assert from "assert";
import { EnglishParser } from "nlcst-parse-english";
import { JapaneseParser } from "nlcst-parse-japanese";

const toString = require("nlcst-to-string");
// const inspect = require('unist-util-inspect');

describe("nlcst-pattern-match", () => {
    it("parse", () => {
        const englishParser = new EnglishParser();
        const patternMatcher = new PatternMatcher({
            parser: englishParser
        });
        assert.ok(patternMatcher instanceof PatternMatcher);
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
            [
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
            `Mismatch
${JSON.stringify(actual)}
`
        );
    });

    describe("#match", () => {
        it("should return MatchResult[]", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`Bob ${{
                type: "*",
                data: {
                    pos: /^VB/ // verb
                }
            }} it.`;
            const text = "Bob does it.";
            const results = patternMatcher.match(text, pattern);
            assert.equal(results.length, 1, "results should have 1");
            const [result] = results;
            assert.deepEqual(result.position, {
                index: 0,
                end: {
                    column: 13,
                    line: 1,
                    offset: 12
                },
                start: {
                    column: 1,
                    line: 1,
                    offset: 0
                }
            });
            assert.deepEqual(
                result.nodeList,
                [
                    {
                        type: "WordNode",
                        children: [
                            {
                                type: "TextNode",
                                value: "Bob",
                                position: {
                                    start: { line: 1, column: 1, offset: 0 },
                                    end: { line: 1, column: 4, offset: 3 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 1, offset: 0 },
                            end: { line: 1, column: 4, offset: 3 }
                        },
                        data: { pos: "NNP" }
                    },
                    {
                        type: "WhiteSpaceNode",
                        value: " ",
                        position: {
                            start: { line: 1, column: 4, offset: 3 },
                            end: { line: 1, column: 5, offset: 4 }
                        }
                    },
                    {
                        type: "WordNode",
                        children: [
                            {
                                type: "TextNode",
                                value: "does",
                                position: {
                                    start: { line: 1, column: 5, offset: 4 },
                                    end: { line: 1, column: 9, offset: 8 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 5, offset: 4 },
                            end: { line: 1, column: 9, offset: 8 }
                        },
                        data: { pos: "VBZ" }
                    },
                    {
                        type: "WhiteSpaceNode",
                        value: " ",
                        position: {
                            start: { line: 1, column: 9, offset: 8 },
                            end: { line: 1, column: 10, offset: 9 }
                        }
                    },
                    {
                        type: "WordNode",
                        children: [
                            {
                                type: "TextNode",
                                value: "it",
                                position: {
                                    start: { line: 1, column: 10, offset: 9 },
                                    end: { line: 1, column: 12, offset: 11 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 10, offset: 9 },
                            end: { line: 1, column: 12, offset: 11 }
                        },
                        data: { pos: "PRP" }
                    },
                    {
                        type: "PunctuationNode",
                        value: ".",
                        position: {
                            start: { line: 1, column: 12, offset: 11 },
                            end: { line: 1, column: 13, offset: 12 }
                        },
                        data: { pos: "." }
                    }
                ],
                `\n${JSON.stringify(result.nodeList)}\n`
            );
            assert.strictEqual(result.text, "Bob does it.");
        });
        it("match data and pattern", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`Click ${{
                type: "*",
                data: {
                    pos: /^VB/ // verb
                }
            }} if you want to ${{
                type: "PatternNode",
                pattern: /[\w\s]+/
            }}.`;
            const text = "Click Delete if you want to delete the entire document.";
            const results = patternMatcher.match(text, pattern);
            assert.strictEqual(
                toString(results[0].nodeList),
                "Click Delete if you want to delete the entire document."
            );
        });
        it("match parameter only", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`${{
                type: "*",
                data: {
                    pos: /^VB/ // verb
                }
            }}`;
            const text = "Bob does that.";
            const results = patternMatcher.match(text, pattern);
            assert.strictEqual(
                toString(results[0].nodeList),
                "does"
            );
        });
        it("match japanese parser", () => {
            const japaneseParser = new JapaneseParser();
            return japaneseParser.ready().then(() => {
                const matcher = new PatternMatcher({
                    parser: japaneseParser
                });
                const TARI = matcher.tag`${{
                    type: "WordNode",
                    data: {
                        pos: "動詞",
                        "pos_detail_1": "自立",
                    }
                }}たり`;
                assert.deepEqual(TARI, [{
                    "type": "WordNode",
                    "data": { "pos": "動詞", "pos_detail_1": "自立" },
                    "position": {
                        "start": { "line": 1, "column": 1, "offset": 0 },
                        "end": { "line": 1, "column": 6, "offset": 5 }
                    }
                }, {
                    "type": "WordNode",
                    "children": [{
                        "type": "TextNode",
                        "value": "たり",
                        "position": {
                            "start": { "line": 1, "column": 6, "offset": 5 },
                            "end": { "line": 1, "column": 8, "offset": 7 }
                        },
                        "data": {
                            "word_id": 92960,
                            "word_type": "KNOWN",
                            "surface_form": "たり",
                            "pos": "助詞",
                            "pos_detail_1": "並立助詞",
                            "pos_detail_2": "*",
                            "pos_detail_3": "*",
                            "conjugated_type": "*",
                            "conjugated_form": "*",
                            "basic_form": "たり",
                            "reading": "タリ",
                            "pronunciation": "タリ"
                        }
                    }],
                    "position": {
                        "start": { "line": 1, "column": 6, "offset": 5 },
                        "end": { "line": 1, "column": 8, "offset": 7 }
                    },
                    "data": {
                        "word_id": 92960,
                        "word_type": "KNOWN",
                        "surface_form": "たり",
                        "pos": "助詞",
                        "pos_detail_1": "並立助詞",
                        "pos_detail_2": "*",
                        "pos_detail_3": "*",
                        "conjugated_type": "*",
                        "conjugated_form": "*",
                        "basic_form": "たり",
                        "reading": "タリ",
                        "pronunciation": "タリ"
                    }
                }], JSON.stringify(TARI))
            });
        });
        it("match regexp", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`This is a ${{
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
        it("variable only pattern", async () => {
            const japaneseParser = new JapaneseParser();
            await japaneseParser.ready();
            const patternMatcher = new PatternMatcher({
                parser: japaneseParser
            });
            const 動詞 = {
                type: "WordNode",
                data: {
                    pos: "動詞",
                    pos_detail_1: "自立"
                }
            };
            const する = {
                type: "WordNode",
                data: {
                    basic_form: "する"
                }
            };
            const pattern = patternMatcher.tag`${動詞}${する}`;
            const text = "行動する";
            const results = patternMatcher.match(text, pattern);
            assert.ok(results.length === 1, "should have 1 result");
        });
        it("A Node `isNegative`, the match result is reverse", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`These ${{
                type: "WordNode",
                children: [
                    {
                        type: "TextNode",
                        value: "are"
                    }
                ],
                isNegative: true // <= match but is negative => not match
            }} ${{
                type: "WordNode",
                data: {
                    pos: /^NN/
                }
            }}.`;
            const text = "These are pen.";
            const results = patternMatcher.match(text, pattern);
            assert.ok(results.length === 0, "should have 1 result");
        });
        it("A Node `isNegative`, the match result is reverse", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`These ${{
                type: "WordNode",
                children: [
                    {
                        type: "TextNode",
                        value: "is"
                    }
                ],
                isNegative: true
            }} ${{
                type: "WordNode",
                data: {
                    pos: /^NN/
                }
            }}.`;
            const text = "These are pen.";
            //                  ^^^
            const results = patternMatcher.match(text, pattern);
            assert.ok(results.length === 1, "should have 1 result");
            const result = results[0];
            assert.strictEqual(
                text.slice(result.position!.start.offset, result.position!.end.offset),
                "These are pen."
            );
        });
        it("WordNode(/^NN/) in Japanese", async () => {
            const japaneseParser = new JapaneseParser();
            await japaneseParser.ready();
            const patternMatcher = new PatternMatcher({
                parser: japaneseParser
            });
            const pattern = patternMatcher.tag`これは${{
                type: "WordNode",
            }}です！`;
            const text = "これは桃です！";
            const results = patternMatcher.match(text, pattern);
            assert.ok(results.length === 1, "should have 1 result");
            const result = results[0];
            assert.strictEqual(
                text.slice(result.position!.start.offset, result.position!.end.offset),
                "これは桃です！"
            );
        });
        it("multiple value on WordNode ", async () => {
            const japaneseParser = new JapaneseParser();
            await japaneseParser.ready();
            const patternMatcher = new PatternMatcher({
                parser: japaneseParser
            });
            const pattern = [
                {
                    type: "WordNode",
                    data: {
                        pos: "動詞",
                        pos_detail_1: "自立",
                    }
                },
                {
                    type: "WordNode",
                    data: {
                        pos: "助詞",
                        surface_form: ["だり", "たり"],
                    }
                }
            ];
            const text = "トイレに行ったり、ご飯を食べる時間もない。.";
            const results = patternMatcher.match(text, pattern);
            assert.ok(results.length === 1, "should have 1 result");
            const result = results[0];
            assert.strictEqual(
                text.slice(result.position!.start.offset, result.position!.end.offset),
                "行ったり"
            );
        });
    });

    describe("#matchCST", () => {
        it("should return MatchCSTResult[]", () => {
            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`Bob ${{
                type: "*",
                data: {
                    pos: /^VB/ // verb
                }
            }} it.`;
            const text = "Bob does it.";
            const CST = englishParser.parse(text);
            const results = patternMatcher.matchCST(CST, pattern);
            assert.equal(results.length, 1, "results should have 1");
            const [result] = results;
            assert.deepEqual(result.position, {
                index: 0,
                end: {
                    column: 13,
                    line: 1,
                    offset: 12
                },
                start: {
                    column: 1,
                    line: 1,
                    offset: 0
                }
            });
            assert.deepEqual(
                result.nodeList,
                [
                    {
                        type: "WordNode",
                        children: [
                            {
                                type: "TextNode",
                                value: "Bob",
                                position: {
                                    start: { line: 1, column: 1, offset: 0 },
                                    end: { line: 1, column: 4, offset: 3 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 1, offset: 0 },
                            end: { line: 1, column: 4, offset: 3 }
                        },
                        data: { pos: "NNP" }
                    },
                    {
                        type: "WhiteSpaceNode",
                        value: " ",
                        position: {
                            start: { line: 1, column: 4, offset: 3 },
                            end: { line: 1, column: 5, offset: 4 }
                        }
                    },
                    {
                        type: "WordNode",
                        children: [
                            {
                                type: "TextNode",
                                value: "does",
                                position: {
                                    start: { line: 1, column: 5, offset: 4 },
                                    end: { line: 1, column: 9, offset: 8 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 5, offset: 4 },
                            end: { line: 1, column: 9, offset: 8 }
                        },
                        data: { pos: "VBZ" }
                    },
                    {
                        type: "WhiteSpaceNode",
                        value: " ",
                        position: {
                            start: { line: 1, column: 9, offset: 8 },
                            end: { line: 1, column: 10, offset: 9 }
                        }
                    },
                    {
                        type: "WordNode",
                        children: [
                            {
                                type: "TextNode",
                                value: "it",
                                position: {
                                    start: { line: 1, column: 10, offset: 9 },
                                    end: { line: 1, column: 12, offset: 11 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 10, offset: 9 },
                            end: { line: 1, column: 12, offset: 11 }
                        },
                        data: { pos: "PRP" }
                    },
                    {
                        type: "PunctuationNode",
                        value: ".",
                        position: {
                            start: { line: 1, column: 12, offset: 11 },
                            end: { line: 1, column: 13, offset: 12 }
                        },
                        data: { pos: "." }
                    }
                ],
                `\n${JSON.stringify(result.nodeList)}\n`
            );
        });
        it("can match node list", () => {

            const englishParser = new EnglishParser();
            const patternMatcher = new PatternMatcher({
                parser: englishParser
            });
            const pattern = patternMatcher.tag`Bob ${{
                type: "*",
                data: {
                    pos: /^VB/ // verb
                }
            }} it.`;
            const text = "Bob does it.";
            const CST = englishParser.parse(text);
            const results = patternMatcher.matchCST(CST, pattern);
            const resultOne = results[0].nodeList;
            assert.ok(patternMatcher.testCST(CST, resultOne), "pass test")
        });
    });
});
