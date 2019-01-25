/**
 * MIT © 2017 azu
 * Original
 * @author Kenichiro Murata
 * @copyright 2015 Kenichiro Murata
 * @license MIT
 * @fileoverview Japanese (natural language) parser.
 */

"use strict";
import { toWideSymbolForJapanese } from "./japanese-util";
import { Root } from "nlcst-types";
import { Parent, Node, Text } from "unist-types";

const { getTokenizer } = require("kuromojin");

/**
 * Kuromoji tag
 * https://github.com/takuyaa/kuromoji.js#api
 */
export interface IpadicFeatures {
    word_id?: number;
    word_type: "KNOWN" | "UNKNOWN";
    surface_form: string;
    pos: string;
    pos_detail_1: string;
    pos_detail_2?: string;
    pos_detail_3?: string;
    conjugated_type?: string;
    conjugated_form?: string;
    basic_form: string;
    reading?: string;
    pronunciation?: string;
}

/**
 * Constants.
 */

const LINEBREAKE_MARK = /\r?\n/g;
const M_OP = "括弧開";
const M_CP = "括弧閉";
const M_P = "句点";
const WS = "空白";

/**
 * サロゲートペアに対応した配列化
 * @param str
 * @returns {Array|{index: number, input: string}|*|Array}
 */
function stringToArray(str: string) {
    return str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
}

/**
 * Tokenize
 */
function tokenize(
    parser: {
        tokenizer: any;
        pos: boolean;
        position: boolean;
    },
    text: string
): Root {
    let linedepth = 0;
    let offset = 0;
    let line: number, column: number;

    const textLines: string[] = text.split(LINEBREAKE_MARK);

    const rootNode = createRootNode();

    /**
     * Return current position
     * @returns {{line: *, column: *, offset: number}}
     */
    function now() {
        return {
            line: line,
            column: column,
            offset: offset
        };
    }

    /**
     * Return next position
     * @param value
     * @returns {{line, column, offset}|{line: *, column: *, offset: number}}
     */
    function next(value: string) {
        const length = stringToArray(value).length;
        offset += length;
        column += length;
        return now();
    }

    /**
     * Close position of Parent Node
     * @param {Parent} parentNode
     */
    function close(parentNode: Parent): void {
        const firstParentNode = parentNode.children[0];
        parentNode.position = {
            start: firstParentNode.position!.start,
            end: next("")
        };
    }

    /**
     * Create position
     * @param value
     * @returns {{start: ({line, column, offset}|{line: *, column: *, offset: number}), end: ({line, column, offset}|{line: *, column: *, offset: number})}}
     */
    function createPosition(value: string) {
        return {
            start: now(),
            end: next(value)
        };
    }

    /**
     * Create ParentNode for RootNode, SentenceNode and WordNode.
     */
    function createParentNode(type: string, item?: Partial<IpadicFeatures>): Parent {
        const node: any = {
            type: type + "Node",
            children: []
        };
        if (parser.position) {
            node.position = {};
        }
        if (parser.pos && item) {
            node.data = item;
        }
        return node;
    }

    /**
     * Create ParentNode for RootNode, SentenceNode and WordNode.
     */
    function createRootNode(): Root {
        const node: any = {
            type: "RootNode",
            children: []
        };
        if (parser.position) {
            node.position = {};
        }
        return node;
    }

    /**
     * Create TextNode for SymbolNode, PunctuationNode, WhiteSpaceNode, SourceNode, and TextNode.
     * @param type
     * @param item
     * @returns {{type: string, value: *}}
     */
    function createTextNode(type: string, item: IpadicFeatures): Text {
        const node: any = {
            type: type + "Node",
            value: item.surface_form
        };
        if (parser.position && item.surface_form) {
            node.position = createPosition(item.surface_form);
        }
        if (parser.pos) {
            node.data = item;
        }
        return node;
    }

    /**
     * Add Node to ParentNode and calculate position
     * @param node
     * @param parent
     */
    function add(node: Node, parent: Parent) {
        parent.children.push(node);
        if (parser.position) {
            const firstParentNode = parent.children[0];
            parent.position =
                firstParentNode.position && node.position
                    ? {
                          start: firstParentNode.position.start,
                          end: node.position.end
                      }
                    : undefined;
        }
    }

    /**
     * Callback Function
     * @param element
     * @param index
     * @param array
     */
    function tokenizeByLine(element: string, index: number, array: string[]) {
        line = index + 1;
        column = 1;

        let paragraphNode = createParentNode("Paragraph");
        let sentenceNode = createParentNode("Sentence");
        let wordNode = createParentNode("Word");

        // 空行の場合
        if (element === "") {
            // 文章の最後の改行による空行でなければ改行ノードを追加する
            if (index !== array.length - 1) {
                // 改行ノードをParagraphNodeに追加する
                add(
                    createTextNode("WhiteSpace", {
                        word_type: "KNOWN",
                        surface_form: "\n",
                        basic_form: "\n",
                        pos: "記号",
                        pos_detail_1: "空白"
                    }),
                    paragraphNode
                );
                // ParagraphNodeをRoodNodeに追加
                add(paragraphNode, rootNode);
            }
            return;
        }

        // 半角括弧を全角括弧に変換
        const str = toWideSymbolForJapanese(element);
        // kuromoji.jsにより形態素解析を行う
        const data = parser.tokenizer.tokenize(str);

        // 分解された文字列単位にNLCST Treeを生成する
        for (let tindex = 0; tindex < data.length; tindex++) {
            const item = data[tindex];
            // REMOVE word_position
            // positionがword_positionの代わりとなるため
            delete item.word_position;
            // 行頭の場合
            if (tindex === 0) {
                // SentenceNodeをParagraphNodeに追加
                add(sentenceNode, paragraphNode);
            }

            // 文字が空白の場合
            if (item.pos_detail_1 === WS) {
                // インラインの場合
                if (linedepth) {
                    add(createTextNode("WhiteSpace", item), sentenceNode);
                } else {
                    // アウトラインの場合
                    // WordNodeに子ノードが存在する場合、WordNodeを終了する
                    if (wordNode.children.length) {
                        add(wordNode, sentenceNode);
                        wordNode = createParentNode("Word");
                    }
                    add(createTextNode("WhiteSpace", item), sentenceNode);
                }
            } else if (item.pos_detail_1 === M_OP) {
                // 文字が開括弧の場合
                linedepth++;
                add(createTextNode("Punctuation", item), sentenceNode);
            } else if (item.pos_detail_1 === M_CP) {
                // 文字が閉括弧の場合
                linedepth--;
                add(createTextNode("Punctuation", item), sentenceNode);
            } else if (item.pos_detail_1 === M_P) {
                // 文字が句点の場合
                add(createTextNode("Punctuation", item), sentenceNode);
                // アウトラインの場合、WordNodeを終了し、次のWordNodeを作る
                if (!linedepth) {
                    // 行末でなければ次のSentenceNodeを作る
                    if (tindex !== data.length - 1) {
                        sentenceNode = createParentNode("Sentence");
                        add(sentenceNode, paragraphNode);
                    }
                }
            } else {
                // その他の文字の場合、Textを作ってWordに入れる
                add(createTextNode("Text", item), wordNode);
                wordNode.data = item;
                add(wordNode, sentenceNode);
                wordNode = createParentNode("Word");
            }

            // 行末の場合
            if (tindex === data.length - 1) {
                // WordNodeに子ノードが存在する場合、WordNodeを終了する（句点で終わらない文章の場合）
                if (wordNode.children.length > 0) {
                    add(wordNode, sentenceNode);
                }
                // 改行ノードをParagraphNodeに追加する
                // add(
                //     createTextNode("WhiteSpace", {
                //         word_type: "KNOWN",
                //         surface_form: "\n",
                //         basic_form: "\n",
                //         pos: "記号",
                //         pos_detail_1: "空白"
                //     }),
                //     paragraphNode
                // );
                // instead of \n, close it
                close(paragraphNode);
                // ParagraphNodeをRoodNodeに追加
                add(paragraphNode, rootNode);
                close(rootNode);
            }
        }
    }

    textLines.forEach(tokenizeByLine);
    return rootNode;
}

/**
 * Japaneses text parser
 */
export class JapaneseParser {
    private tokenizer!: { tokenize(text: string): any };
    private dicPath?: string;

    constructor(options: { dicPath?: string } = {}) {
        this.dicPath = options.dicPath;
    }

    public ready() {
        const options = this.dicPath && { dicPath: this.dicPath };
        return getTokenizer(options).then((tokenizer: any) => {
            this.tokenizer = tokenizer;
        });
    }

    parse(text: string): Root {
        if (this.tokenizer === undefined) {
            throw new Error("Should call ready() and then call parse()");
        }
        const parserOptions = {
            tokenizer: this.tokenizer,
            pos: true,
            position: true
        };
        return tokenize(parserOptions, text);
    }
}
