
# noa-examples

Two small example worlds built on the [noa](https://github.com/andyhall/noa) voxel engine.

Live demos:
 * [hello-world](https://andyhall.github.io/noa-examples/hello-world/) - a bare minimum world, suitable for building on top of
 * [test](https://andyhall.github.io/noa-examples/test/) - a testbed world that minimally implements most engine features


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

----

## Dependency / build notes

### Babylon dependency:

`Noa` uses [Babylon.js](https://www.babylonjs.com/) as its 3D engine, but references it as a peer dependency (so that game worlds can specify their Babylon version/modules). This means game worlds should declare a dependency on `@babylonjs/core` or similar, rather than loading in a prebuilt babylon script.

### noa dependency:

The `noa` engine is under active development, so this module declares its dependency directly on the source repo's develop branch (`github:andyhall/noa#develop`), so as to pull in the latest bleeding-edge build. If you want to hack on something stable you may want to change the dependency to `noa-engine` (to get the current stable build from npm), or a specific `noa` version/commit/etc.

### When hacking on the engine:

If you want to hack on both the engine and a game world side-by-side, just clone the `noa` repo next to your game client then import it directly:

```js
import Engine from '../../noa' // or wherever
```

This is preferable to editing your client's `package.json` or using `npm link`, as npm behaves weirdly when trying to resolve peer dependencies via path references or symlinks.

----

## Credits

Made by [@fenomas](https://twitter.com/fenomas), license is ISC.


