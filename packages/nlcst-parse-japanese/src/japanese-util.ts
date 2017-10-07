// The MIT License (MIT)
// Copyright (c) 2014-2017 Yusuke Hirao
// https://github.com/jaco-project/jaco-js
/**
 * キーがパターン・値が置換文字列のハッシュマップによって置換する
 *
 * @version 2.0.0
 * @since 0.1.0
 * @param str 対象の文字列
 * @param convMap キーがパターン・値が置換文字列のハッシュマップ
 */
export function replaceFromMap(str: string, convMap: { [pattern: string]: string }): string {
    for (const needle in convMap) {
        if (convMap.hasOwnProperty(needle)) {
            const replace = convMap[needle];
            str = str.replace(new RegExp(needle, "g"), replace);
        }
    }
    return str;
}

/**
 * 日本語で使われる記号を全角に変換
 *
 * @version 2.0.0
 * @since 0.4.0
 * @param str 対象の文字列
 */
export function toWideSymbolForJapanese(str: string): string {
    str = replaceFromMap(str, {
        "｡": "。",
        "｢": "「",
        "｣": "」",
        "､": "、",
        "･": "・"
    });
    return str;
}
