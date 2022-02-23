import { PatternMatchDictArgs, replaceAll, matchTestReplace } from "../src/match-test-replace";
import * as assert from "assert";
import { PatternMatcher } from "nlcst-pattern-match";
import { EnglishParser } from "nlcst-parse-english";

describe("testMatchReplace", () => {
    describe("PatternMatchDictArgs", () => {
        it("replace args", () => {
            const text = "ALL-XYZ_ABC";
            const replaceArgsCaptures: PatternMatchDictArgs[] = [];
            const res = matchTestReplace(text, {
                pattern: /X(Y+)Z.*(ABC)/,
                replace: (args) => {
                    replaceArgsCaptures.push(args);
                    return "";
                },
            });
            assert.ok(res.ok === true, "should be ok: true");
            assert.strictEqual(replaceArgsCaptures.length, 1, "replace should be called 1");
            const replaceArgsCapture = replaceArgsCaptures[0];
            assert.strictEqual(replaceArgsCapture.index, 4, "index");
            assert.deepEqual(replaceArgsCapture.match, "XYZ_ABC");
            assert.strictEqual(replaceArgsCapture.all, "ALL-XYZ_ABC");
            assert.deepEqual(replaceArgsCapture.captures, ["Y", "ABC"]);
        });
        it("test args", () => {
            const text = "ALL-XYZ_ABC";
            const testArgsCaptures: PatternMatchDictArgs[] = [];
            const res = matchTestReplace(text, {
                pattern: /X(Y+)Z.*(ABC)/,
                replace: () => {
                    return "";
                },
                test: (args: PatternMatchDictArgs) => {
                    testArgsCaptures.push(args);
                    return true;
                },
            });
            assert.ok(res.ok === true, "should be ok: true");
            assert.strictEqual(testArgsCaptures.length, 1, "replace should be called 1");
            const replaceArgsCapture = testArgsCaptures[0];
            assert.strictEqual(replaceArgsCapture.index, 4, "index");
            assert.deepEqual(replaceArgsCapture.match, "XYZ_ABC");
            assert.strictEqual(replaceArgsCapture.all, "ALL-XYZ_ABC");
            assert.deepEqual(replaceArgsCapture.captures, ["Y", "ABC"]);
            // replace results
            assert.strictEqual(replaceAll(text, res.results).output, "ALL-");
        });
    });
    describe("replaceAll", () => {
        it("should replace ", () => {
            const text = "12345asdfghjkl";
            const res = matchTestReplace(text, {
                pattern: /\w+/,
                replace: ({ match }) => match.toUpperCase(),
            });
            const replacedText = replaceAll(text, res.results).output;
            assert.strictEqual(replacedText, "12345ASDFGHJKL");
        });
        it("should work to multiple results", () => {
            const text = "12345asdfghjkl";
            const res = matchTestReplace(text, {
                pattern: /(\d)/g,
                replace: ({ captures }) => {
                    return `${captures[0]}_`;
                },
            });
            assert.strictEqual(res.results.length, 5);
            const replacedText = replaceAll(text, res.results).output;
            assert.strictEqual(replacedText, "1_2_3_4_5_asdfghjkl");
        });
    });
    describe("testMatchReplace", () => {
        it("should return ok:false when no match", () => {
            const text = "Hello";
            const res = matchTestReplace(text, {
                pattern: /no match/,
                replace: () => "Hello",
            });
            assert.ok(res.ok === false, "should be ok: false");
            assert.strictEqual(res.results.length, 0, "no results");
        });
        it("should return ok:true when match", () => {
            const text = "Hello";
            const res = matchTestReplace(text, {
                pattern: /hello/i,
                replace: () => "Hello",
            });
            assert.ok(res.ok, "should be ok: true");
            assert.strictEqual(res.results.length, 1, "1 replace");
        });
        it("should return ok:true when test() => false, but it is not replace", () => {
            const text = "before";
            const res = matchTestReplace(text, {
                pattern: /before/i,
                replace: () => "after",
                test: () => {
                    return false;
                },
            });
            assert.ok(res.ok === true, "should be ok: false");
            assert.strictEqual(res.results.length, 0, "no replace");
        });
        it("should return results if return ok:true and test() => true", () => {
            const text = "webkit is matched,but node-webkit is not match";
            const res = matchTestReplace(text, {
                pattern: /(\S*?)webkit/g,
                replace: () => "WebKit",
                test: ({ captures }) => {
                    return captures[0] !== "node-";
                },
            });
            assert.ok(res.ok === true, "should be ok: false");
            assert.strictEqual(res.results.length, 1, "no replace");
            assert.strictEqual(replaceAll(text, res.results).output, "WebKit is matched,but node-webkit is not match");
        });
        it("should replace complex example", () => {
            const englishParser = new EnglishParser();
            const matcher = new PatternMatcher({ parser: englishParser });
            // https://developers.google.com/style/clause-order
            // NG: Click Delete if you want to delete the entire document.
            // OK: To delete the entire document, click Delete.
            const text = "Click Delete if you want to delete the entire document.";
            const res = matchTestReplace(text, {
                pattern: /Click (\w+) if you want to (.+)./,
                replace: ({ captures }) => {
                    return `To ${captures[1]}, click ${captures[0]}.`;
                },
                test: ({ all }) => {
                    const pattern = matcher.tag`Click ${{
                        type: "WordNode",
                        data: {
                            // Verb
                            pos: /^VB/,
                        },
                    }}`;
                    return matcher.test(all, pattern);
                },
            });
            assert.ok(res.ok === true, "should be ok: true");
            const output = replaceAll(text, res.results).output;
            assert.strictEqual(output, "To delete the entire document, click Delete.");
        });
    });
});
