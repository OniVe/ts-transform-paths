# ts-transform-paths

[![circleci](https://badgen.net/circleci/github/OniVe/ts-transform-paths)](https://circleci.com/gh/OniVe/ts-transform-paths)
[![npm-version](https://badgen.net/npm/v/ts-transform-paths)](https://www.npmjs.com/package/ts-transform-paths)
[![npm-downloads](https://badgen.net/npm/dm/ts-transform-paths)](https://www.npmjs.com/package/ts-transform-paths)
[![license](https://badgen.net/npm/license/ts-transform-paths)](https://www.npmjs.com/package/ts-transform-paths)

Use this to load modules whose location is specified in the paths section of
tsconfig.json.

## Install

```sh
yarn add ts-transform-paths -D
```

## Requirement

TypeScript >= 2.4.1

## How to use

Unfortunately, TypeScript itself does not currently provide any easy way to use
custom transformers (See https://github.com/Microsoft/TypeScript/issues/14419).
The followings are the example usage of the custom transformer.

### tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@schema": ["./src/schema"],
      "@modules/*": ["./src/modules/*"]
    }
  }
}
```

### webpack (with ts-loader or awesome-typescript-loader)

```js
// webpack.config.js
const pathsTransformer = require("ts-transform-paths").default;

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader", // or 'awesome-typescript-loader'
        options: {
          getCustomTransformers: (program) => ({
            before: [pathsTransformer(program)]
          })
        }
      }
    ]
  }
};
```

### Rollup (with rollup-plugin-typescript2)

```js
// rollup.config.js
import typescript from "rollup-plugin-typescript2";
import pathsTransformer from "ts-transform-paths";

export default {
  // ...
  plugins: [
    typescript({
      transformers: [
        (service) => ({
          before: [pathsTransformer(service.getProgram())],
          after: []
        })
      ]
    })
  ]
};
```

### ttypescript

See
[ttypescript's README](https://github.com/cevek/ttypescript/blob/master/README.md)
for how to use this with module bundlers such as webpack or Rollup.

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "plugins": [{ "transform": "ts-transform-paths" }]
  }
  // ...
}
```

### ts-node

```ts
// my-ts-script.ts
import { MyClass } from "@schema";

const myClass = new MyClass("Message");
```

```js
// index.js
const pathsTransformer = require("ts-transform-paths").default;

require("ts-node").register({
  transformers: {
    before: [pathsTransformer()]
  }
});

require("./my-ts-script");
```

and run

```sh
yarn node ./index.js
```

## Thanks

- [tsconfig-paths](https://github.com/dividab/tsconfig-paths)
- [ts-transform-img](https://github.com/longlho/ts-transform-img)
- [ts-transformer-keys](https://github.com/kimamula/ts-transformer-keys)
