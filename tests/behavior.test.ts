import * as mocha from 'mocha';
import * as chai from 'chai';
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';
import fg from 'fast-glob';
import {parse} from '../src';

import {Git} from 'git-interface';

const {describe, it, before} = mocha;
const {expect} = chai;

// These tests are confirm that the intermediate JSON files output by the Harmony compile
// can be processed completely by this library tools

describe('Intermediate JSON output should be able to be processed gracefully', () => {
    // Also creates the directory.
    const git = new Git({dir: __dirname});
    const harmonyDirectory = path.join(__dirname, 'harmony');
    before(async function () {
        this.timeout(0);
        // Pull latest version of Harmony from the github repo
        if (!fs.existsSync(harmonyDirectory)) {
            console.log("Cloning Harmony code from GitHub");
            await git.clone("git@github.coecis.cornell.edu:rv22/harmony.git", "harmony", {depth: 1});
        } else if (fs.existsSync(path.join(harmonyDirectory, ".git"))) {
            console.log("Pulling Harmony code from origin");
            await git.reset();
            await git.pull("origin");
        }
        console.log("Done!");
        // Build the harmony compiler
        child_process.execSync("make all", {cwd: harmonyDirectory});

        // Compile every possible Harmony source code and output Harmony intermediate object file.
        const harmonyFiles = await fg("code/**/*.hny", {cwd: harmonyDirectory});
        for (const f of harmonyFiles) {
            const dirname = path.dirname(f);
            const basename = path.basename(f, ".hny");
            const objFileName = path.join(harmonyDirectory, dirname, basename + ".hco");
            if (!fs.existsSync(objFileName)) {
                console.log("Compiling and model checking", f);
                const sourceCode = path.join(harmonyDirectory, f);
                try {
                    child_process.execFileSync(
                        path.join(harmonyDirectory, "harmony"),
                        [sourceCode],
                        {cwd: harmonyDirectory});
                } catch (err) {
                    console.error(err);
                }
            } else {
                console.log("Found a previously compiled version of", f);
            }
        }
        return;
    });

    it('Should process every Harmony hco file', async () => {
        // Glob every .hco file produced by the compiler.
        const harmonyFiles = await fg("code/**/*.hco", {cwd: harmonyDirectory});
        const charmonyModelDirectory = path.join(__dirname, "result");
        if (fs.existsSync(charmonyModelDirectory)) {
            fs.rmdirSync(charmonyModelDirectory, {recursive: true});
        }
        fs.mkdirSync(charmonyModelDirectory);

        for (const f of harmonyFiles) {
            const filename = path.join(harmonyDirectory, f);
            const json = JSON.parse(fs.readFileSync(filename, 'utf-8'));
            console.log("Processing the hco file", filename)
            expect(() => {
                // Check that we can parse the files completely.
                const topLevelCharmonyModel = parse(json);
                if (topLevelCharmonyModel.issue === "No issues") {
                    expect(topLevelCharmonyModel.state).equals("No issues");
                    expect("idToThreadName" in topLevelCharmonyModel).is.false;
                    expect("slices" in topLevelCharmonyModel).is.false;
                    expect("macroSteps" in topLevelCharmonyModel).is.false;
                    expect("microSteps" in topLevelCharmonyModel).is.false;
                } else {
                    expect(topLevelCharmonyModel.state).equals("Issues found");
                    expect("idToThreadName" in topLevelCharmonyModel).is.true;
                    expect("slices" in topLevelCharmonyModel).is.true;
                    expect("macroSteps" in topLevelCharmonyModel).is.true;
                    expect("microSteps" in topLevelCharmonyModel).is.true;
                }

                const outputFile = path.join(charmonyModelDirectory, f + ".json");
                const parentDir = path.dirname(outputFile);
                if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, {recursive: true});
                fs.writeFileSync(
                    outputFile, JSON.stringify(topLevelCharmonyModel, undefined, 2));
            }).not.throw();
        }
        return;
    });
});

