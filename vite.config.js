
import { resolve } from 'path'
import { defineConfig } from 'vite'




export default defineConfig(({ command, mode, ssrBuild }) => {

    if (mode === 'production') {
        // can change config thusly..
    }

    return {

        root: './src',
        base: './',

        resolve: {
            extensions: ['.js'],
            alias: {},
            dedupe: [
                // This is needed if importing noa-engine from the local filesystem,
                // but doesn't hurt anything if you're importing normally.
                '@babylonjs/core',
            ],
        },

        plugins: [],

        server: {
            port: 8080,
            host: '0.0.0.0',
        },

        // production build stuff
        build: {
            target: 'es2020',
            outDir: `../docs`,          // relative to root, not this file!
            emptyOutDir: true,          // since build is outside root dir
            chunkSizeWarningLimit: 1200, // babylon chunk for these demos is ~1.1MB
            minify: true,

            rollupOptions: {
                // safe to remove all these if you only have one entry point
                input: {
                    index: resolve(__dirname, 'src/index.html'),
                    test: resolve(__dirname, 'src/test/index.html'),
                    stress: resolve(__dirname, 'src/stress/index.html'),
                    helloWorld: resolve(__dirname, 'src/hello-world/index.html'),
                },

                // remove this if you don't want babylon in its own chunk
                manualChunks: (id) => {
                    if (id.includes('@babylon')) return 'babylon'
                },
            },

        },


        // misc
        clearScreen: false,
        logLevel: 'info',
    }
})


