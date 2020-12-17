

/* 
 *
 *
 *      Testbed.
 *
 * 
 */


// Engine options object, and engine instantiation:
import Engine from 'noa-engine'

// or import from local filesystem when hacking locally:
// import Engine from '/Users/andy/dev/game/noa'


import { initRegistration } from './registration'
import { initWorldGen } from './worldgen'
import { setupPlayerEntity } from './entities'
import { setupInteractions } from './actions'
import { setupFog } from './fog'



// create engine
var noa = new Engine({
    debug: true,
    showFPS: true,
    inverseY: true,
    inverseX: false,
    chunkSize: 32,
    chunkAddDistance: 3.5,
    chunkRemoveDistance: 3.0,
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
})


// this registers all the blocks and materials
var blockIDs = initRegistration(noa)

// this sets up worldgen
initWorldGen(noa, blockIDs)

// adds a mesh to player
setupPlayerEntity(noa)

// does stuff on button presses
setupInteractions(noa)

//
setupFog(noa)

