'use strict'

var path = require('path')
var buildPath = path.resolve('..', '..', 'docs', 'hello-world')



module.exports = (env) => ({

    mode: (() => {
        return (env && env.production) ?
            'production' : 'development'
    })(),

    entry: './index.js',
    resolve: {

        /*
         * Note: this next setting is only necessary if the project declares 
         * a dependency on `noa-engine` via the local file system. 
         * If you pull in `noa-engine` normally from npm or from a 
         * github link then this setting shouldn't be necessary 
         * (though I don't think it breaks anything..)
        */
        symlinks: false,

    },
    performance: {
        // change the default size warnings
        maxEntrypointSize: 1.5e6,
        maxAssetSize: 1.5e6,
    },
    output: {
        path: buildPath,
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: buildPath,
        inline: true,
        host: "0.0.0.0",
        stats: "minimal",
    },
})
