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
    isWord,
} from "../src/type-guard";

describe("nlcst", () => {
    describe("Root", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "RootNode",
            };
            assert.ok(isRoot(node), "node should be Root");
        });
    });
    describe("Paragraph", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "ParagraphNode",
            };
            assert.ok(isParagraph(node), "node should be Paragraph");
        });
    });
    describe("Sentence", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "SentenceNode",
            };
            assert.ok(isSentence(node), "node should be Sentence");
        });
    });
    describe("Word", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "WordNode",
            };
            assert.ok(isWord(node), "node should be Word");
        });
    });
    describe("Text", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "TextNode",
            };
            assert.ok(isText(node), "node should be Text");
        });
    });
    describe("Symbol", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "SymbolNode",
            };
            assert.ok(isSymbol(node), "node should be Symbol");
        });
    });
    describe("Punctuation", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "PunctuationNode",
            };
            assert.ok(isPunctuation(node), "node should be Punctuation");
        });
    });
    describe("WhiteSpace", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "WhiteSpaceNode",
            };
            assert.ok(isWhiteSpace(node), "node should be WhiteSpace");
        });
    });
    describe("Source", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "SourceNode",
            };
            assert.ok(isSource(node), "node should be Source");
        });
    });
    describe("TextNode", () => {
        it("should detect by typeGuard function", () => {
            const node = {
                type: "TextNode",
            };
            assert.ok(isTextNode(node), "node should be TextNode");
        });
    });
});
