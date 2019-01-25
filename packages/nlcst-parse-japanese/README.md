# nlcst-parse-japanese

Parse Japanese text and output as [NLCST](https://github.com/syntax-tree/nlcst).

## Install

Install with [npm](https://www.npmjs.com/):

    npm install nlcst-parse-japanese

## Tokenized Data

This library use [kuromoji.js](https://github.com/takuyaa/kuromoji.js#api "kuromoji.js") via [kuromojin](https://github.com/azu/kuromojin).

[NLCST](https://github.com/syntax-tree/nlcst) Node's `data` property is following values.


| Property        | Example     | Description               |
| --------------- | :---------- | ------------------------- |
| word_type       | 'KNOWN'     | 単語タイプ(辞書に登録されている単語ならKNOWN |
| surface_form    | '黒文字'       | 表層形                       |
| pos             | '名詞'        | 品詞                        |
| pos_detail_1    | '一般'        | 品詞細分類1                    |
| pos_detail_2    | '*'         | 品詞細分類2                    |
| pos_detail_3    | '*'         | 品詞細分類3                    |
| conjugated_type | '*'         | 活用型                       |
| conjugated_form | '*'         | 活用形                       |
| basic_form      | '黒文字'       | 基本形                       |
| reading         | 'クロモジ'      | 読み                        |
| pronunciation   | 'クロモジ'    |      発音                     |


## Usage

```ts
import {JapaneseParser} from "nlcst-parse-japanese";
const japaneseParser = new JapaneseParser();
const text = "ようこそ、日本へ。";
japaneseParser.ready().then(() => {
    const CST = japaneseParser.parse(text);
    console.log(CST)
});
/*
{
  "type": "RootNode",
  "children": [
    {
      "type": "ParagraphNode",
      "children": [
        {
          "type": "SentenceNode",
          "children": [
            {
              "type": "WordNode",
              "children": [
                {
                  "type": "TextNode",
                  "value": "ようこそ",
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 5,
                      "offset": 4
                    }
                  },
                  "data": {
                    "word_id": 34120,
                    "word_type": "KNOWN",
                    "word_position": 1,
                    "surface_form": "ようこそ",
                    "pos": "感動詞",
                    "pos_detail_1": "*",
                    "pos_detail_2": "*",
                    "pos_detail_3": "*",
                    "conjugated_type": "*",
                    "conjugated_form": "*",
                    "basic_form": "ようこそ",
                    "reading": "ヨウコソ",
                    "pronunciation": "ヨーコソ"
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 1,
                  "column": 1,
                  "offset": 0
                },
                "end": {
                  "line": 1,
                  "column": 5,
                  "offset": 4
                }
              },
              "data": {
                "word_id": 34120,
                "word_type": "KNOWN",
                "word_position": 1,
                "surface_form": "ようこそ",
                "pos": "感動詞",
                "pos_detail_1": "*",
                "pos_detail_2": "*",
                "pos_detail_3": "*",
                "conjugated_type": "*",
                "conjugated_form": "*",
                "basic_form": "ようこそ",
                "reading": "ヨウコソ",
                "pronunciation": "ヨーコソ"
              }
            },
            {
              "type": "WordNode",
              "children": [
                {
                  "type": "TextNode",
                  "value": "、",
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 5,
                      "offset": 4
                    },
                    "end": {
                      "line": 1,
                      "column": 6,
                      "offset": 5
                    }
                  },
                  "data": {
                    "word_id": 51340,
                    "word_type": "KNOWN",
                    "word_position": 5,
                    "surface_form": "、",
                    "pos": "名詞",
                    "pos_detail_1": "数",
                    "pos_detail_2": "*",
                    "pos_detail_3": "*",
                    "conjugated_type": "*",
                    "conjugated_form": "*",
                    "basic_form": "、",
                    "reading": "、",
                    "pronunciation": "、"
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 1,
                  "column": 5,
                  "offset": 4
                },
                "end": {
                  "line": 1,
                  "column": 6,
                  "offset": 5
                }
              },
              "data": {
                "word_id": 51340,
                "word_type": "KNOWN",
                "word_position": 5,
                "surface_form": "、",
                "pos": "名詞",
                "pos_detail_1": "数",
                "pos_detail_2": "*",
                "pos_detail_3": "*",
                "conjugated_type": "*",
                "conjugated_form": "*",
                "basic_form": "、",
                "reading": "、",
                "pronunciation": "、"
              }
            },
            {
              "type": "WordNode",
              "children": [
                {
                  "type": "TextNode",
                  "value": "日本",
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 6,
                      "offset": 5
                    },
                    "end": {
                      "line": 1,
                      "column": 8,
                      "offset": 7
                    }
                  },
                  "data": {
                    "word_id": 329310,
                    "word_type": "KNOWN",
                    "word_position": 6,
                    "surface_form": "日本",
                    "pos": "名詞",
                    "pos_detail_1": "固有名詞",
                    "pos_detail_2": "地域",
                    "pos_detail_3": "国",
                    "conjugated_type": "*",
                    "conjugated_form": "*",
                    "basic_form": "日本",
                    "reading": "ニッポン",
                    "pronunciation": "ニッポン"
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 1,
                  "column": 6,
                  "offset": 5
                },
                "end": {
                  "line": 1,
                  "column": 8,
                  "offset": 7
                }
              },
              "data": {
                "word_id": 329310,
                "word_type": "KNOWN",
                "word_position": 6,
                "surface_form": "日本",
                "pos": "名詞",
                "pos_detail_1": "固有名詞",
                "pos_detail_2": "地域",
                "pos_detail_3": "国",
                "conjugated_type": "*",
                "conjugated_form": "*",
                "basic_form": "日本",
                "reading": "ニッポン",
                "pronunciation": "ニッポン"
              }
            },
            {
              "type": "WordNode",
              "children": [
                {
                  "type": "TextNode",
                  "value": "へ",
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 8,
                      "offset": 7
                    },
                    "end": {
                      "line": 1,
                      "column": 9,
                      "offset": 8
                    }
                  },
                  "data": {
                    "word_id": 92260,
                    "word_type": "KNOWN",
                    "word_position": 8,
                    "surface_form": "へ",
                    "pos": "助詞",
                    "pos_detail_1": "格助詞",
                    "pos_detail_2": "一般",
                    "pos_detail_3": "*",
                    "conjugated_type": "*",
                    "conjugated_form": "*",
                    "basic_form": "へ",
                    "reading": "ヘ",
                    "pronunciation": "エ"
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 1,
                  "column": 8,
                  "offset": 7
                },
                "end": {
                  "line": 1,
                  "column": 9,
                  "offset": 8
                }
              },
              "data": {
                "word_id": 92260,
                "word_type": "KNOWN",
                "word_position": 8,
                "surface_form": "へ",
                "pos": "助詞",
                "pos_detail_1": "格助詞",
                "pos_detail_2": "一般",
                "pos_detail_3": "*",
                "conjugated_type": "*",
                "conjugated_form": "*",
                "basic_form": "へ",
                "reading": "ヘ",
                "pronunciation": "エ"
              }
            },
            {
              "type": "PunctuationNode",
              "value": "。",
              "position": {
                "start": {
                  "line": 1,
                  "column": 9,
                  "offset": 8
                },
                "end": {
                  "line": 1,
                  "column": 10,
                  "offset": 9
                }
              },
              "data": {
                "word_id": 90940,
                "word_type": "KNOWN",
                "word_position": 9,
                "surface_form": "。",
                "pos": "記号",
                "pos_detail_1": "句点",
                "pos_detail_2": "*",
                "pos_detail_3": "*",
                "conjugated_type": "*",
                "conjugated_form": "*",
                "basic_form": "。",
                "reading": "。",
                "pronunciation": "。"
              }
            }
          ],
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 10,
              "offset": 9
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 10,
          "offset": 9
        }
      }
    }
  ],
  "position": {
    "start": {
      "line": 1,
      "column": 1,
      "offset": 0
    },
    "end": {
      "line": 1,
      "column": 10,
      "offset": 9
    }
  }
}
*/
```

## Options

If you [have problem loading dictionaries](https://github.com/azu/nlp-pattern-match/issues/5), you can pass an accessible `dictPath` to the options:

```js
const japaneseParser = new JapaneseParser({ dicPath: '/dict' });
```

## Changelog

See [Releases page](https://github.com/azu/nlp-pattern-match/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/nlp-pattern-match/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu

### Original

> The MIT License (MIT)
> Copyright (c) 2015 Kenichiro Murata
> https://github.com/muraken720/parse-japanese