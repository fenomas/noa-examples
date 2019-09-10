

/*
 * 
 * 
 *		testbed world generation
 * 
 * 
*/

// this module implements two "worlds" of voxel data
var currentWorld = 'world1'

// FIFO queue of worldgen requests from the engine,
var worldgenRequestQueue = []

// storage for data from voxels that were unloaded
var cruncher = require('voxel-crunch')
var storage = {}



export function initWorldGen(noa, blockIDs) {

    // add a binding to swap "worlds"
    noa.inputs.bind('swap-world', 'O')
    noa.inputs.down.on('swap-world', function () {
        currentWorld = (currentWorld === 'world1') ? 'world2' : 'world1'
        noa.world.invalidateAllChunks()
    })


    // store worldgen requests from the engine
    noa.world.on('worldDataNeeded', function (id, array, x, y, z) {
        worldgenRequestQueue.push({ id, array, x, y, z })
    })

    // store data from chunks being unloaded
    noa.world.on('chunkBeingRemoved', function (id, array, userData) {
        var storageID = userData
        storage[storageID] = cruncher.encode(array.data)
    })

    // process the queue asynchronously
    setInterval(function () {
        if (worldgenRequestQueue.length === 0) return
        var req = worldgenRequestQueue.shift()
        var storageID = `${req.id}:${currentWorld}`
        if (storage[storageID]) {
            // fill in chunk ndarray from storage
            cruncher.decode(storage[storageID], req.array.data)
            storage[storageID] = null
        } else {
            // generate a new chunk of voxel data
            if (currentWorld === 'world1') {
                generateChunk1(req.array, req.x, req.y, req.z)
            } else {
                generateChunk2(req.array, req.x, req.y, req.z)
            }
        }
        // pass the finished data back to the game engine
        noa.world.setChunkData(req.id, req.array, storageID)
    }, 30)




    // two functions to generate world data
    // `data` is an ndarray - see https://github.com/scijs/ndarray

    function generateChunk1(array, x, y, z) {
        for (var i = 0; i < array.shape[0]; ++i) {
            for (var k = 0; k < array.shape[2]; ++k) {
                var height = getHeightMap(x + i, z + k, 10, 30)
                for (var j = 0; j < array.shape[1]; ++j) {
                    var b = decideBlock(x + i, y + j, z + k, height)
                    if (b) array.set(i, j, k, b)
                }
            }
        }
    }

    function generateChunk2(array, x, y, z) {
        for (var i = 0; i < array.shape[0]; ++i) {
            for (var k = 0; k < array.shape[2]; ++k) {
                var height = getHeightMap(x + i, z + k, 20, 40)
                for (var j = 0; j < array.shape[1]; ++j) {
                    var b = decideBlock(x + i, y + j, z + k, height)
                    if (b) array.set(i, j, k, b)
                }
            }
        }
    }

    // helpers

    // worldgen - return a heightmap for a given [x,z]
    function getHeightMap(x, z, xsize, zsize) {
        var xs = 0.8 + 2 * Math.sin(x / xsize)
        var zs = 0.4 + 2 * Math.sin(z / zsize + x / 30)
        return xs + zs
    }

    function decideBlock(x, y, z, height) {
        // flat area to NE
        if (x > 0 && z > 0) {
            var h = 1
            if (z == 63 || x == 63) h = 20
            return (y < h) ? blockIDs.grassID : 0
        }
        // general stuff
        if (y < height) {
            return (y < 0) ? blockIDs.dirtID : blockIDs.grassID
        } else {
            return (y < 1) ? blockIDs.waterID : 0
        }
    }



    // After the world is initialzed, fill in a bunch of test blocks. 
    // There's no particular significance to these, I use them to 
    // debug meshing and AO and whatnot

    setTimeout(function () {
        addWorldFeatures()
    }, 1000)

    function addWorldFeatures() {
        noa.setBlock(blockIDs.testID1, -6, 5, 6)
        noa.setBlock(blockIDs.testID2, -4, 5, 6)
        noa.setBlock(blockIDs.testID3, -2, 5, 6)

        var z = 5
        makeRows(10, 5, z, blockIDs.shinyDirtID)
        makeRows(10, 5, z + 2, blockIDs.dirtID)
        makeRows(10, 5, z + 5, blockIDs.dirtID)
        makeRows(10, 5, z + 9, blockIDs.dirtID)
        makeRows(10, 5, z + 14, blockIDs.dirtID)
        z += 18
        makeRows(10, 5, z, blockIDs.customID)
        makeRows(10, 5, z + 2, blockIDs.customID)
        makeRows(10, 5, z + 5, blockIDs.customID)
        makeRows(10, 5, z + 9, blockIDs.customID)
        makeRows(10, 5, z + 14, blockIDs.customID)
    }

    function makeRows(length, x, z, block) {
        for (var i = 0; i < length; i++) {
            noa.setBlock(block, x + i, 1, z + i)
            noa.setBlock(block, length * 2 + x - i, 1, z + i)
        }
    }
}

