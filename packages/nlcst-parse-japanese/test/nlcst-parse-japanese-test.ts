// MIT © 2017 azu
import { JapaneseParser } from "../src/nlcst-parse-japanese";
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

describe("nlcst-parse-japanese", () => {
    let japaneseParse: JapaneseParser;
    before(async () => {
        japaneseParse = new JapaneseParser();
        await japaneseParse.ready();
    });
    const fixturesDir = path.join(__dirname, "test-patterns");
    fs.readdirSync(fixturesDir).map((caseName: string) => {
        it(`${caseName.replace(/-/g, " ")}`, () => {
            const fixtureDir = path.join(fixturesDir, caseName);
            let actualPath = path.join(fixtureDir, "input.txt");
            const actualContent = fs.readFileSync(actualPath, "utf-8");
            const actual = japaneseParse.parse(actualContent);

            if (path.sep === "\\") {
                // Specific case of windows, transformFileSync return code with '/'
                actualPath = actualPath.replace(/\\/g, "/");
            }

            const expected = JSON.parse(fs.readFileSync(path.join(fixtureDir, "output.json"), "utf-8"));

            assert.deepEqual(
                actual,
                expected,
                `Mismatch
${JSON.stringify(actual)}
                `
            );
        });
    });
});
