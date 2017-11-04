# nlcst-pattern-match

Pattern match for [NLCST](https://github.com/syntax-tree/nlcst).

## Install

Install with [npm](https://www.npmjs.com/):

    npm install nlcst-pattern-match

## Usage

### `patternMatcher.tag` : `TagPattern` 

`patternMatcher.tag` is a tagged function.
It is used with template literal.

### `patternMatcher.match(text:string, pattern: TagPattern)`

match `text` with `pattern` that is result of `tag` function.

### `patternMatcher.matchCST(cst: Root, pattern: TagPattern)`

match `cst` with `pattern` that is result of `tag` function.

## Example

You write Pattern of NLCST object in `` patternMatcher.tag`${object}` ``. 

```js
import { PatternMatcher } from "nlcst-pattern-match";
import { EnglishParser } from "nlcst-parse-english";
const englishParser = new EnglishParser();
const patternMatcher = new PatternMatcher({
    parser: englishParser
});
const pattern = patternMatcher.tag`Bob ${{
    type: "*",
    data: {
        pos: /^VB/ // verb
    }
}} it.`;
const text = "Bob does it.";
const results = patternMatcher.match(text, pattern);
assert.equal(results.length, 1, "results should have 1");
const [result] = results;
assert.deepEqual(result.position, {
    index: 0,
    end: {
        column: 13,
        line: 1,
        offset: 12
    },
    start: {
        column: 1,
        line: 1,
        offset: 0
    }
});
// https://github.com/syntax-tree/nlcst NodeList
assert.deepEqual(
    result.nodeList,
    [
        {
            type: "WordNode",
            children: [
                {
                    type: "TextNode",
                    value: "Bob",
                    position: {
                        start: { line: 1, column: 1, offset: 0 },
                        end: { line: 1, column: 4, offset: 3 }
                    }
                }
            ],
            position: {
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 1, column: 4, offset: 3 }
            },
            data: { pos: "NNP" }
        },
        {
            type: "WhiteSpaceNode",
            value: " ",
            position: {
                start: { line: 1, column: 4, offset: 3 },
                end: { line: 1, column: 5, offset: 4 }
            }
        },
        {
            type: "WordNode",
            children: [
                {
                    type: "TextNode",
                    value: "does",
                    position: {
                        start: { line: 1, column: 5, offset: 4 },
                        end: { line: 1, column: 9, offset: 8 }
                    }
                }
            ],
            position: {
                start: { line: 1, column: 5, offset: 4 },
                end: { line: 1, column: 9, offset: 8 }
            },
            data: { pos: "VBZ" }
        },
        {
            type: "WhiteSpaceNode",
            value: " ",
            position: {
                start: { line: 1, column: 9, offset: 8 },
                end: { line: 1, column: 10, offset: 9 }
            }
        },
        {
            type: "WordNode",
            children: [
                {
                    type: "TextNode",
                    value: "it",
                    position: {
                        start: { line: 1, column: 10, offset: 9 },
                        end: { line: 1, column: 12, offset: 11 }
                    }
                }
            ],
            position: {
                start: { line: 1, column: 10, offset: 9 },
                end: { line: 1, column: 12, offset: 11 }
            },
            data: { pos: "PRP" }
        },
        {
            type: "PunctuationNode",
            value: ".",
            position: {
                start: { line: 1, column: 12, offset: 11 },
                end: { line: 1, column: 13, offset: 12 }
            },
            data: { pos: "." }
        }
    ],
    `\n${JSON.stringify(result.nodeList)}\n`
);
assert.strictEqual(result.text, "Bob does it.");
```

### Wildcard(`*`)

`*` value is match all value.

```ts
const englishParser = new EnglishParser();
const patternMatcher = new PatternMatcher({
    parser: englishParser
});
const pattern = patternMatcher.tag`These are ${{
    type: "*", // <= any type is ok
    data: {
        pos: /^NN/
    }
}}.`;
const text = "These are cars. Cool!";
const results = patternMatcher.match(text, pattern);
assert.ok(results.length === 1, "should have 1 result");
```

### Addition Nodes

You can use [NLCST](https://github.com/syntax-tree/nlcst) for matching pattern.
Additionally, you can use following special Nodes.


#### PatternNode

PatternNode represent RegExp pattern.

```js
const englishParser = new EnglishParser();
const patternMatcher = new PatternMatcher({
    parser: englishParser
});
const pattern = patternMatcher.tag`if you want to ${{
    type: "PatternNode",
    pattern: /[\w\s]+/
}}.`;
const text = "Click Delete if you want to delete the entire document.";
const results = patternMatcher.match(text, pattern);
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
