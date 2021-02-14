# harmony-uikit
This is the toolkit used for building the interactive process-UI, e.g. parsing charm.json content.

## Install Instructions

This package is not published onto the `npm` registry, but it can be directly installed from the GitHub repository. Run the following commands:

```sh
# npm
npm install git+ssh://git@github.com:harmonylang/harmony-uikit.git#main

# yarn
yarn add git+ssh://git@github.com:harmonylang/harmony-uikit.git#main
```

This will perform the installation and any project building, i.e. the TypeScript compilation.

## Usage

The package directly exposes two main libraries/functions.
1. `parse`: which parses an JS-object representation of the `charm.json` file emitted by the Harmony compiler.
2. `charmonyType`: which exposes the types used when parsing the intermediate `charm.json` JS-object representation.

## Questions

Please create an issue in the Issues tab, or directly email me at `contact@anthonyyang.dev`.
