
# noa-examples

Two small example worlds built on the [noa](https://github.com/fenomas/noa) voxel engine. The easiest way to get started with `noa` is to clone this repo and hack on these demos.

Live demos:
 * [hello-world](https://fenomas.github.io/noa-examples/hello-world/) - a bare minimum world, suitable for building on top of
 * [test](https://fenomas.github.io/noa-examples/test/) - a testbed world that minimally implements most engine features

Interactions in the "Test" demo:
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
npm start     # runs /src/hello-world
npm test      # runs /src/test
```

The `start` and `test` scripts serve each world via `webpack-dev-server`, so you should be able to find them at `localhost:8080` or thereabouts.

There's also a `build` script to generate bundles into the `docs` directories.

Note: those using React may want to refer to [@MCArth/noa-cra-example](https://github.com/MCArth/noa-cra-example), which is a ported noa example built with `create-react-app`.


----

## Dependency / build notes

### Babylon dependency:

`Noa` uses [Babylon.js](https://www.babylonjs.com/) for 3D rendering, but references it as a peer dependency (so that game worlds can specify their Babylon version/modules). This means game worlds should declare a dependency on `@babylonjs/core` or similar, rather than loading in a prebuilt babylon script.

### noa dependency:

The `noa` engine is under active development. This module pulls in the latest release (`v0.31.0`), but if you want the lastest stable (probably!) version, change your dependency in `package.json` to:

```json
    "noa-engine": "github:fenomas/noa#develop",
```

and you'll get the latest version of the #develop branch, where new feature work is done.

### When hacking on both a game and on the engine:

If you want to hack on both the engine and a game world side-by-side, clone the `noa` repo next to your game client then import it directly:

```js
import { Engine } from '../../noa' // or wherever
```

This is preferable to editing your client's `package.json` or using `npm link`, as npm behaves weirdly when trying to resolve peer dependencies via path references or symlinks.

----

## Credits

Made with 🍺 by [@fenomas](https://fenomas.com), license is ISC.


