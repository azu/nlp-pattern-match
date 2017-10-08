# test-match-replace

Easy text pattern match and replace text.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install test-match-replace

## Usage

```ts
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
```

## Example

```js
import * as assert from "assert";
import { replaceAll, testMatchReplace } from "test-match-replace";
import { PatternMatcher } from "nlcst-pattern-match";
import { EnglishParser } from "nlcst-parse-english";
const englishParser = new EnglishParser();
const matcher = new PatternMatcher({ parser: englishParser });
// https://developers.google.com/style/clause-order
// NG: Click Delete if you want to delete the entire document.
// OK: To delete the entire document, click Delete.
const text = 'Click Delete if you want to delete the entire document.';
const res = testMatchReplace(text, {
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
