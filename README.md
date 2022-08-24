
# noa-examples

Two small example worlds built on the [noa](https://github.com/fenomas/noa) voxel engine. The easiest way to get started with `noa` is to clone this repo and hack on these demos.

Live demos:
 * [hello-world](https://fenomas.github.io/noa-examples/hello-world/) - a bare minimum world, suitable for building on top of
 * [testbed](https://fenomas.github.io/noa-examples/test/) - a testbed world that minimally implements most engine features
 * [stress test](https://fenomas.github.io/noa-examples/stress/) - a demo made to test longer view distances with more complicated terrain

Interactions in the **"Testbed"** demo:
 * `LMB`: break blocks
 * `RMB`/`R`: make blocks (pick block type with `MMB`/`Q`)
 * `I`: invert mouse
 * `P`: pause/unpause
 * `1`: shoot a physics projectile
 * `3`: toggle timescale (between `1`, `0.1`, `2`)
 * `O`: swap between two sets of world data
 * `mousewheel`: zoom camera in and out

----

## Usage

To build and serve the examples locally:

```sh
(clone this repo)
cd noa-examples
npm install
npm start     # serves the "hello-world" demo
npm test      # serves the "test" demo
```

The `start` and `test` scripts build serve each world on `localhost:8080`.

There's also a `build` to generate all bundles into the `docs` directories, using `esbuild`. If you prefer `webpack`, here is a sample [webpack config](src/hello-world/webpack.config.js).

Note: those using React may want to refer to [@MCArth/noa-cra-example](https://github.com/MCArth/noa-cra-example), which is a ported noa example built with `create-react-app`.


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


