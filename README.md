# nlp-pattern-match

Natural Language pattern matching library for JavaScript.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install nlp-pattern-match

## Usage

- [ ] Implement

Parser:

- https://github.com/wooorm/parse-latin
- https://github.com/wooorm/parse-english
- https://github.com/muraken720/parse-japanese


```js
import {PatternMatcher} from "nlp-pattern-match";
import {noun} from "nlp-pattern-tag-english";
import Parser from "parse-english";
// https://github.com/syntax-tree/nlcst
const matcher = PatternMatcher({
    parser: new Parser()
});
const text = "This is a pen";
const pattern = matcher.tag`This is a ${noun()}`;
const results = matcher.match(text, pattern);
/*
    [
        {
            index: 10,
            text: "pen",
            position: 
            nodeList: []
        }
    ]
 */
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
