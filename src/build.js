
var esbuild = require('esbuild')
var path = require('path')




// input arguments
var worldDir = process.argv[2] || ''
var serve = (process.argv[3] === 'serve')

var known = ['hello-world', 'test', 'stress']
if (!known.includes(worldDir)) {
    throw 'Unknown build target: ' + worldDir
}




// settings
var entry = path.resolve(__dirname, worldDir, 'index.js')
var serveDir = path.resolve(__dirname, '..', 'docs', worldDir)
var outFile = path.resolve(serveDir, 'bundle.js')




// This is an esbuild plugin that makes all @babylon imports resolve to the 
// current project's version, even if a locally-stored peer dependency has its own.
// It's equivalent to `resolve.alias` in webpack configs.
var mergeImportsPlugin = {
    name: 'babylon-import-resolve',
    setup(build) {
        build.onResolve({ filter: /^@babylonjs/ }, args => {
            return { path: require.resolve(args.path) }
        })
    },
}




if (serve) {

    // local dev-server

    console.log('Serving on 8080: ' + worldDir)
    esbuild.serve({
        servedir: serveDir,
        port: 8080,
    }, {
        entryPoints: [entry],
        outfile: outFile,
        plugins: [mergeImportsPlugin],
        define: { global: '{}' }, // for node-centric dependencies
        logLevel: 'info',
        bundle: true,
        minify: true,
        sourcemap: true,
        target: 'es6',
    }).catch((err) => {
        console.log(err)
        process.exit(1)
    })


} else {


    // just build and exit
    console.log('Building: ' + worldDir)
    esbuild.build({
        entryPoints: [entry],
        outfile: outFile,
        plugins: [mergeImportsPlugin],
        define: { global: '{}' }, // for node-centric dependencies
        logLevel: 'info',
        bundle: true,
        minify: true,
        sourcemap: true,
        target: 'es6',
    }).catch((err) => {
        console.log(err)
        process.exit(1)
    })

}

