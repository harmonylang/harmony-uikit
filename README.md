# harmony-uikit
This is the toolkit used for building the interactive process-UI, e.g. parsing charm.json content.

## Install Instructions

This package is not published onto the `npm` registry, but it can be directly installed from the GitHub repository. Run one of the following commands:

```sh
# npm
npm install git+ssh://git@github.com:harmonylang/harmony-uikit.git#release

# yarn
yarn add git+ssh://git@github.com:harmonylang/harmony-uikit.git#release
```

This will perform the installation and any project building, i.e. the TypeScript compilation.

## Usage

The package directly exposes two main libraries/functions.
1. `parse`: a function which parses an JS-object representation of the `charm.json` file emitted by the Harmony compiler.
2. Type Definitions: a collection of types which are used when parsing the intermediate `charm.json` JS-object representation.

## Development

Because this package is not published onto the `npm` registry, the `install` command cannot be used for local development. Instead, run `yarn setup` to install the `node_modules` required for the project.

### getExecutedCode(json: IntermediateJson): CharmonyExecutedCode[]

This function accepts the intermediate JSON and returns an array of all executed Harmony code. It uses the `explain` and `code` fields of the intermediate JSON. A particular `location` is defined as a point in the written Harmony **source code** and contains the first PC of the assembly code corresponding to that source code. For each `location`, retrieve the assembly code that is executed from the starting PC to the last PC.

The assembly code may include instructions that are not directly part of any particular line in the source code. The current implementation checks for setup assembly code, i.e. the assembly code starting at PC = 0 and ending at the earlist starting PC of source code.

## Questions

Please create an issue in the Issues tab, or directly email me at `contact@anthonyyang.dev`.
