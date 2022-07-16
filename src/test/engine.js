
/**
 * 
 *      Instantiate the core noa engine object
 * 
*/

// normally import from the module
// import { Engine } from 'noa-engine'

// ...or import from local filesystem when hacking locally:
import { Engine } from '../../../noa'


// options and instantiation
export var noa = new Engine({
    debug: true,
    showFPS: true,
    inverseY: true,
    inverseX: false,
    chunkSize: 32,
    chunkAddDistance: [2, 1.5],     // [horiz, vert]
    blockTestDistance: 50,
    texturePath: 'textures/',
    playerStart: [0.5, 5, 0.5],
    playerHeight: 1.4,
    playerWidth: 0.6,
    playerAutoStep: true,
    useAO: true,
    AOmultipliers: [0.92, 0.8, 0.5],
    reverseAOmultiplier: 1.0,
    manuallyControlChunkLoading: false,
    originRebaseDistance: 25,
})


