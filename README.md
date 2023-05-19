
# noa-examples

Several small example worlds built on the [noa](https://github.com/fenomas/noa) voxel engine. The easiest way to get started with `noa` is to clone this repo and hack on these demos.

Live demos:
 * [hello-world](https://fenomas.github.io/noa-examples/hello-world/) - a bare minimum world, suitable for building on top of
 * [testbed](https://fenomas.github.io/noa-examples/test/) - a testbed world that minimally implements most/all engine features
 * [stress test](https://fenomas.github.io/noa-examples/stress/) - a demo made to test the performance of long view distances and crunchy terrain

----

## Usage

To build and serve the examples locally:

```sh
# (clone this repo)
cd noa-examples
npm install
npm test      # serves demos on localhost:8080
npm start     # serves demos in prod mode
```

Then open `localhost:8080` to view the three demos.

There's also a `build` script to generate all bundles into the `docs` directories, using `vite`. If you prefer `webpack`, the hello-world demo has a sample [webpack config](src/hello-world/webpack.config.js).

Those using React may want to check [@MCArth/noa-cra-example](https://github.com/MCArth/noa-cra-example), which is a ported noa example built with `create-react-app`.


----

## Dependency / build notes

### Babylon dependency:

`Noa` uses [Babylon.js](https://www.babylonjs.com/) for 3D rendering, but references it as a peer dependency (so that game worlds can specify their Babylon version/modules). This means game worlds should declare a dependency on `@babylonjs/core` or similar, rather than loading in a prebuilt babylon script.

### noa dependency:

This engine is under active development. The current release is available from npm as `noa-engine`, but if you want the latest changes may want to change your `package.json` to point to the `#develop` branch on github:

```json
  "dependencies": {
    "noa-engine": "github:fenomas/noa#develop",
  },
```

Or, if you want to hack on both the engine and a game world together, it's easiest to clone the [noa](https://github.com/fenomas/noa) repo alongside to this one, and then edit `package.json` to reference your local copy of the engine:

```json
  "dependencies": {
    "noa-engine": "file:../noa",
  },
```

Note that after changing `package.json` you'll need to run `npm i`.

----

## Credits

Made with 🍺 by [@fenomas](https://fenomas.com), license is ISC.


