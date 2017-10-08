# nlp-pattern-match [![Build Status](https://travis-ci.org/azu/nlp-pattern-match.svg?branch=master)](https://travis-ci.org/azu/nlp-pattern-match)

Natural Language pattern matching library for JavaScript.

This library based on [NLCST](https://github.com/syntax-tree/nlcst) that is Natural Language Concrete Syntax Tree format.

You can write pattern match syntax using Part-of-speech(POS) tagging, Morphological Analysis(形態素解析).

## Packages

This repository is monorepo.
This repository includes following packages.

| Package | npm |
| ------  | --- |
| nlcst-parse-english | [![npm](https://img.shields.io/npm/v/nlcst-parse-english.svg?style=flat-square)](https://www.npmjs.com/package/nlcst-parse-english) |
| nlcst-parse-japanese | [![npm](https://img.shields.io/npm/v/nlcst-parse-japanese.svg?style=flat-square)](https://www.npmjs.com/package/nlcst-parse-japanese) |
| nlcst-pattern-match | [![npm](https://img.shields.io/npm/v/nlcst-pattern-match.svg?style=flat-square)](https://www.npmjs.com/package/nlcst-pattern-match) |
| nlcst-types | [![npm](https://img.shields.io/npm/v/nlcst-types.svg?style=flat-square)](https://www.npmjs.com/package/nlcst-types) |
| unist-types | [![npm](https://img.shields.io/npm/v/unist-types.svg?style=flat-square)](https://www.npmjs.com/package/unist-types) |

## Support Language

Support English and Japanese.
In other words, We have the above language parser for NLCST.

If you want to add language, Welcome to Pull Request.

## Example

[NLCST](https://github.com/syntax-tree/nlcst) Parser and Pattern match.

You write Pattern of NLCST object in `patternMatcher.tag`${object}`. 

For more details, See [nlcst-pattern-match](./packages/nlcst-pattern-match) document.

```js
import { PatternMatcher } from "nlcst-pattern-match";
import { EnglishParser } from "nlcst-parse-english";
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
    text.slice(result.position.start.offset, result.position.end.offset),
    "This is a pen."
);
```

Make named capture

```js
const dict = {
    // https://developers.google.com/web/updates/2017/07/upcoming-regexp-features
    pattern: /This is (?<noun>\w+)/,
    replace: 'This is a $<noun>',
    message: ({ noun }) => {
        return `$<noun> is not noun`;
    },
    test: ({ noun }) => {
        return new Tag(noun).type === "noun"
    }
};
match(text, dict);
/*
{
    ok: boolean,
    results: [{
        index: number,
        match: string,
        replace: string,
        message: string    
    }]
}

function splice(str, index, count, insert) {
  return str.substring(0, index) + 
    ((insert === null || insert === undefined) ? '' : insert) + 
    str.substring(index + count);
};
const res = match(text, dict);
if(res.ok){
    res.results.forEach(result => {
        text = splice(text, index, index + match.length, result.replace)
    });
}
*/
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
