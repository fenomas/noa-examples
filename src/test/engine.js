
/**
 * 
 *      Instantiate the core noa engine object
 * 
*/

// Engine options object, and engine instantiation.
import { Engine } from 'noa-engine'


// options and instantiation
export var noa = new Engine({
    debug: true,
    showFPS: true,
    inverseY: true,
    inverseX: false,
    chunkSize: 32,
    chunkAddDistance: [3, 2],     // [horiz, vert]
    blockTestDistance: 50,
    playerStart: [0.5, 5, 0.5],
    playerHeight: 1.4,
    playerWidth: 0.6,
    playerAutoStep: true,
    playerShadowComponent: false,
    useAO: true,
    AOmultipliers: [0.92, 0.8, 0.5],
    reverseAOmultiplier: 1.0,
    manuallyControlChunkLoading: false,
    originRebaseDistance: 10,
    lightVector: [0.6, -1, -0.4],
})

// setup view for convenient testing
noa.camera.zoomDistance = 10
noa.camera.pitch = 0.3
noa.camera.heading = 0.3
