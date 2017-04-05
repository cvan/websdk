# WebSDK

The Universal SDK for Web Applications.


## Features

* Written using [Webpack (version 2)](https://webpack.js.org/).
* JavaScript source code written in [ES6](http://es6-features.org/).
* Exports an [UMD](https://github.com/umdjs/umd) format, so the library works everywhere.
* ES6-based test setup using [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/).
* Linting with [Semistandard](http://eslint.org/).


## Local development

### Installation

1. Install [Node.js](https://nodejs.org/en/download/package-manager/) (which includes [npm](https://www.npmjs.com/)), if you haven't already.
2. Clone this repository ([`WebVRRocks/moonrise`](https://github.com/WebVRRocks/moonrise)):

    ```bash
    mkdir -p websdk
    git clone git@github.com:cvan/websdk.git websdk/websdk
    ```
3. In the root directory of the cloned repository of the project, install the [Node](https://nodejs.org/en/download/package-manager/) dependencies:

    ```bash
    cd websdk/websdk/
    npm install
    ```

4. From the `websdk/websdk/` directory, run these commands:

    ```bash
    # Start application for local development (w/ live-reloading, error handling).
    npm start

    # Generate packaged modules for distribution.
    npm run dist
    ```

### Process

```
ES6 source files
       |
       |
    webpack
       |
       +--- babel, eslint
       |
  ready-to-use
     library
  in UMD format
```

> **NOTE:** The library must be built before publishing. The files under the `dist` folder are the ones that should be distributed.

### Building

To install the project's latest Node dependencies:

```sh
npm install
```

To generate the minified version of the library:

```sh
npm run build
```

### Development

When all the latest dependencies are installed, run `npm start` (or `npm run dev`). This will generate a non-minified version of the library and will run a watcher so you get the compilation on file change.

### Tests

To run the tests:

```sh
npm run test
```

### Scripts

* **`npm run dist`** – builds the distribution-ready production version of the library under the `dist` folder.
* **`npm run build`** – builds the production version of the library under the `build` folder.
* **`npm start`** – builds the development version of the library and runs a file watcher.
* **`npm run test`** – runs tests.
* **`npm run test:watch`** – runs tests in a continuous watch mode.


## Acknowledgments

Thank you to the following projects and individuals:

* [`webpack-library-starter](https://github.com/krasimir/webpack-library-starter) (Licensed under [MIT](https://github.com/krasimir/webpack-library-starter/blob/master/LICENSE))


## Contributing

[Contributions are very welcome!](CONTRIBUTING.md)


## License

All code and content within this source-code repository is licensed under the [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

You can copy, modify, distribute and perform this work, even for commercial purposes, all without asking permission.

For more information, refer to these following links:

* a copy of the [license](LICENSE.md) in [this source-code repository](https://github.com/webvrrocks/moonrise)
* the [human-readable summary](https://creativecommons.org/publicdomain/zero/1.0/) of the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
* the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
