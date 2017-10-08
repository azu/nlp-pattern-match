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
| match-test-replace | [![npm](https://img.shields.io/npm/v/match-test-replace.svg?style=flat-square)](https://www.npmjs.com/package/match-test-replace) |
| nlcst-types | [![npm](https://img.shields.io/npm/v/nlcst-types.svg?style=flat-square)](https://www.npmjs.com/package/nlcst-types) |
| unist-types | [![npm](https://img.shields.io/npm/v/unist-types.svg?style=flat-square)](https://www.npmjs.com/package/unist-types) |

## Status

Version 1.x is experimental.

## Support Language

Support English and Japanese.
In other words, We have the above language parser for NLCST.

If you want to add language, Welcome to Pull Request.

## Match strictly

[NLCST](https://github.com/syntax-tree/nlcst) Parser and Pattern match.

You write Pattern of NLCST object in `patternMatcher.tag`${object}`. 

[nlcst-pattern-match](./packages/nlcst-pattern-match) aim to provide that match strict pattern.

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

## Easy to replace 

[match-test-replace](./pacakges/match-test-replace) aim to provide match, test and replace easily.

```js
import { replaceAll, matchTestReplace } from "match-test-replace";
const text = "webkit is matched,but node-webkit is not match";
const res = matchTestReplace(text, {
    pattern: /(\S*?)webkit/g,
    replace: () => "WebKit",
    replaceTest: ({ captures }) => {
        return captures[0] !== "node-";
    }
});
assert.ok(res.ok === true, "should be ok: false");
assert.strictEqual(res.results.length, 1, "no replace");
assert.strictEqual(replaceAll(text, res.results).output, "WebKit is matched,but node-webkit is not match");
```


## Easy + Strict

Easy match and replace, but test strictly.

```js
import * as assert from "assert";
import { replaceAll, matchTestReplace } from "match-test-replace";
import { PatternMatcher } from "nlcst-pattern-match";
import { EnglishParser } from "nlcst-parse-english";
const englishParser = new EnglishParser();
const matcher = new PatternMatcher({ parser: englishParser });
// https://developers.google.com/style/clause-order
// NG: Click Delete if you want to delete the entire document.
// OK: To delete the entire document, click Delete.
const text = 'Click Delete if you want to delete the entire document.';
const res = matchTestReplace(text, {
    pattern: /Click (\w+) if you want to (.+)./,
    replace: ({ captures }) => {
        console.log(captures);
        return `To ${captures[1]}, click ${captures[0]}.`
    },
    replaceTest: ({ all }) => {
        const pattern = matcher.tag`Click ${{
            type: "WordNode",
            data: {
                // Verb
                pos: /^VB/
            }
        }}`;
        return matcher.test(all, pattern);
    }
});
assert.ok(res.ok === true, "should be ok: true");
const output = replaceAll(text, res.results).output;
assert.strictEqual(output, "To delete the entire document, click Delete.");
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
