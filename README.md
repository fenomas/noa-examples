
# noa-examples

Two small example worlds built on the [noa](https://github.com/andyhall/noa) voxel engine.

Live demos:
 * [hello-world](https://andyhall.github.io/noa-examples/hello-world/) - a bare minimum world, suitable for building on top of
 * [test](https://andyhall.github.io/noa-examples/test/) - a testbed world where I debug engine features


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

If you want to hack on both the engine and a game world side-by-side, the easiest way is to clone the `noa` repo next to this one, and change this module's dependency to point at `"file:../noa"` or whatever. However there is some [weirdness with how webpack resolves peer dependencies on the local file system](https://medium.com/@penx/managing-dependencies-in-a-node-package-so-that-they-are-compatible-with-npm-link-61befa5aaca7). 

The fix for this is to include `symlinks: false` in your webpack config. This is already done in this repo, but if you start from scratch and get build errors, that's the reason.

----

## Credits

Made by [@fenomas](https://twitter.com/fenomas), license is ISC.


