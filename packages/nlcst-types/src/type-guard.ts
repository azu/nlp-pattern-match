// MIT © 2017 azu
import { Paragraph, Punctuation, Root, Sentence, Source, TextNode, WhiteSpace, Word } from "./nlcst-types";

export const isRoot = (v: any): v is Root => {
    return v && v.type === "Root";
};
export const isParagraph = (v: any): v is Paragraph => {
    return v && v.type === "Paragraph";
};
export const isSentence = (v: any): v is Sentence => {
    return v && v.type === "Sentence";
};
export const isWord = (v: any): v is Word => {
    return v && v.type === "Word";
};
export const isText = (v: any): v is Text => {
    return v && v.type === "Text";
};
export const isSymbol = (v: any): v is Symbol => {
    return v && v.type === "Symbol";
};
export const isPunctuation = (v: any): v is Punctuation => {
    return v && v.type === "Punctuation";
};
export const isWhiteSpace = (v: any): v is WhiteSpace => {
    return v && v.type === "WhiteSpace";
};
export const isSource = (v: any): v is Source => {
    return v && v.type === "Source";
};
export const isTextNode = (v: any): v is TextNode => {
    return v && v.type === "TextNode";
};
