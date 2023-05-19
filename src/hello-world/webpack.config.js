

/**
 * Webpack config  -  this is not currently used, but is here as 
 * a reference if you want it. It's not maintained and may need tweaks.
 * 
 * Note that to use this config, you'll need to put a suitable `index.html` file
 * in the build directory, with <script> tags for `bundle.js` and `babylon.js`.
 *
 *  
 * Then to build:
 *      npm i webpack webpack-cli
 *      cd src/hello-world
 *      webpack --env prod
 * 
 */




var path = require('path')
var buildPath = path.resolve('../../docs/hello-world')
var entryPath = path.resolve('./index.js')
var babylonPath = path.resolve('../../node_modules/@babylonjs')



module.exports = (env) => ({

    mode: (env && env.prod) ? 'production' : 'development',

    entry: entryPath,
    output: {
        path: buildPath,
        filename: 'bundle.js',
    },

    resolve: {
        alias: {
            /* This resolve is necessary when importing noa-engine from the 
             * local filesystem in order to hack on it. 
             * (but it shouldn't break anything when importing noa normally)
            */
            '@babylonjs': babylonPath,
        },
    },

    performance: {
        // change the default size warnings
        maxEntrypointSize: 1.5e6,
        maxAssetSize: 1.5e6,
    },

    stats: "minimal",

    devtool: 'source-map',
    devServer: {
        static: buildPath,
    },

    // make the dev server's polling use less CPU :/
    watchOptions: {
        aggregateTimeout: 500,
        poll: 1000,
        ignored: ["node_modules"],
    },
    // split out babylon to a separate bundle (since it rarely changes)
    optimization: {
        splitChunks: {
            cacheGroups: {
                babylon: {
                    chunks: 'initial',
                    test: /babylonjs/,
                    filename: 'babylon.js',
                },
            },
        },
    },
})
