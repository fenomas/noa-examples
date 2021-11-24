
var path = require('path')
var buildPath = path.resolve('..', '..', 'docs', 'hello-world')



module.exports = (env) => ({

    mode: (env && env.prod) ? 'production' : 'development',

    entry: './index.js',
    output: {
        path: buildPath,
        filename: 'bundle.js',
    },

    resolve: {
        /* This resolve is necessary when importing noa-engine from the 
         * local filesystem in order to hack on it. 
         * (but it shouldn't break anything when importing noa normally)
        */
        alias: {
            '@babylonjs': path.resolve('../../node_modules/@babylonjs'),
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
