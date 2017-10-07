// MIT © 2017 azu
import * as assert from "assert";
import {
    isParagraph,
    isPunctuation,
    isRoot,
    isSentence,
    isSource,
    isSymbol,
    isText,
    isTextNode,
    isWhiteSpace,
    isWord
} from "../src/type-guard";

describe("nlcst", () => {
    describe("Root", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "Root"
            };
            assert.ok(isRoot(node), "node should be Root");
        });
    });
    describe("Paragraph", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "Paragraph"
            };
            assert.ok(isParagraph(node), "node should be Paragraph");
        });
    });
    describe("Sentence", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "Sentence"
            };
            assert.ok(isSentence(node), "node should be Sentence");
        });
    });
    describe("Word", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "Word"
            };
            assert.ok(isWord(node), "node should be Word");
        });
    });
    describe("Text", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "Text"
            };
            assert.ok(isText(node), "node should be Text");
        });
    });
    describe("Symbol", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "Symbol"
            };
            assert.ok(isSymbol(node), "node should be Symbol");
        });
    });
    describe("Punctuation", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "Punctuation"
            };
            assert.ok(isPunctuation(node), "node should be Punctuation");
        });
    });
    describe("WhiteSpace", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "WhiteSpace"
            };
            assert.ok(isWhiteSpace(node), "node should be WhiteSpace");
        });
    });
    describe("Source", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "Source"
            };
            assert.ok(isSource(node), "node should be Source");
        });
    });
    describe("TextNode", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "TextNode"
            };
            assert.ok(isTextNode(node), "node should be TextNode");
        });
    });
});
