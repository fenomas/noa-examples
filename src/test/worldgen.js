

/*
 * 
 * 
 *		testbed world generation
 * 
 * 
*/

// this module implements two "worlds" of voxel data
var WORLD1 = 'world1'
var WORLD2 = 'world2'

// storage for data from voxels that were unloaded
var cruncher = require('voxel-crunch')
var storage = {}
var chunkIsStored = (id) => { return !!storage[id] }
var storeChunk = (id, arr) => { storage[id] = cruncher.encode(arr.data) }
var retrieveChunk = (id, arr) => { cruncher.decode(storage[id], arr.data) }





export function initWorldGen(noa, blockIDs) {

    // init world name and add binding to swap it    
    noa.worldName = WORLD1
    noa.inputs.bind('swap-world', 'KeyO')
    noa.inputs.down.on('swap-world', function () {
        noa.worldName = (noa.worldName === WORLD1) ? WORLD2 : WORLD1
    })


    // catch engine's chunk removal event, and store the data
    noa.world.on('chunkBeingRemoved', function (id, array, userData) {
        storeChunk(id, array)
    })


    // catch worldgen requests, and queue them to handle asynchronously
    var requestQueue = []
    noa.world.on('worldDataNeeded', function (id, array, x, y, z, worldName) {
        requestQueue.push({ id, array, x, y, z, worldName })
    })



    // process the worldgen request queue:
    setInterval(function () {
        if (requestQueue.length === 0) return
        var req = requestQueue.shift()
        if (chunkIsStored(req.id)) {
            retrieveChunk(req.id, req.array)
        } else {
            generateChunk(req.array, req.x, req.y, req.z, req.worldName)
        }
        // pass the finished data back to the game engine
        noa.world.setChunkData(req.id, req.array)
    }, 10)




    // two versions of world data
    // `data` is an ndarray - see https://github.com/scijs/ndarray
    function generateChunk(array, x, y, z, worldName) {
        if (worldName === WORLD1) generateChunk1(array, x, y, z)
        if (worldName === WORLD2) generateChunk2(array, x, y, z)
    }

    function generateChunk1(array, cx, cy, cz) {
        for (var i = 0; i < array.shape[0]; ++i) {
            var x = cx + i
            for (var k = 0; k < array.shape[2]; ++k) {
                var z = cz + k
                var height = getHeightMap(x, z, 10, 25)
                for (var j = 0; j < array.shape[1]; ++j) {
                    var b = decideBlock(x, cy + j, z, height)
                    if (b) array.set(i, j, k, b)
                }
                var cloudHt = getCloudHt(x, z, 20, 30)
                if (cloudHt > 0) {
                    var cmin = cloudHt - 2 * Math.sin(x / 17)
                    var cmax = cloudHt + 3 * Math.sin(z / 22)
                    for (j = 0; j < array.shape[1]; ++j) {
                        if (cy + j < cmin || cy + j > cmax) continue
                        array.set(i, j, k, blockIDs.cloudID)
                    }
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
                    if (b === blockIDs.grassID) b = blockIDs.grass2ID
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
        var hs = Math.sin(27 + x / 37)
        hs += Math.sin(23 + z / 33)
        if (hs > 1.7) xs += 8 * (hs - 1.7)
        return xs + zs
    }

    function getCloudHt(x, z, xsize, zsize) {
        var xs = 5 + 5 * Math.sin(5 + x / xsize)
        var zs = 6 + 4 * Math.sin(8 + z / zsize + x / 35)
        var ss = 3 + 7 * Math.sin((x + z) / 17)
        return (xs + zs + ss > 20) ? 35 : -1
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
            if (y >= 1) return 0
            // alternate by depth between two different water IDs
            return (y % 2) ? blockIDs.waterID : blockIDs.water2ID
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

        noa.setBlock(blockIDs.windowID, -5, 3, 6)
        noa.setBlock(blockIDs.windowID, -4, 3, 6)
        noa.setBlock(blockIDs.windowID, -3, 3, 6)

        noa.setBlock(blockIDs.testa, -6, 4, 6)
        noa.setBlock(blockIDs.testb, -5, 4, 6)
        noa.setBlock(blockIDs.testc, -4, 4, 6)

        noa.setBlock(blockIDs.waterPole, -18, -1, 6)
        noa.setBlock(blockIDs.waterPole, -16, -1, 6)
        noa.setBlock(blockIDs.waterPole, -14, -1, 6)

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

