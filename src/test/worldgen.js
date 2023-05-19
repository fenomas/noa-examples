
import { noa } from './engine'
import { blockIDs } from './registration'
import { encode, decode } from 'voxel-crunch'



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

var storage = {}
var chunkIsStored = (id) => { return !!storage[id] }
var storeChunk = (id, arr) => { storage[id] = encode(arr.data) }
var retrieveChunk = (id, arr) => { decode(storage[id], arr.data) }




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


/**
 * 
 *    Here is the core worldgen handler - it catches `worldDataNeeded` 
 *    events and pushes them to a queue, and then in a setInterval 
 *    handles each request and calls `world.setChunkData`.
 * 
 */

var requestQueue = []
noa.world.on('worldDataNeeded', function (id, array, x, y, z, worldName) {
    requestQueue.push({ id, array, x, y, z, worldName })
})

setInterval(function () {
    for (var i = 0; i < 10; i++) {
        if (requestQueue.length === 0) return
        var req = requestQueue.shift()
        if (chunkIsStored(req.id)) {
            retrieveChunk(req.id, req.array)
        } else {
            // skip out of generating very high or low chunks
            if (req.y < -50 || req.y > 50) {
                var fillVoxel = (req.y >= 0) ? 0 : blockIDs.stone
                return noa.world.setChunkData(req.id, req.array, null, fillVoxel)
            }
            // real worldgen:
            generateChunk(req.array, req.x, req.y, req.z, req.worldName)
        }
        // pass the finished data back to the game engine
        noa.world.setChunkData(req.id, req.array)
    }
}, 10)





/**
 * 
 *      World gen logic - two versions, to test world data swapping.
 * 
 */

// `data` is an ndarray - see https://github.com/scijs/ndarray
function generateChunk(array, x, y, z, worldName) {
    if (worldName === WORLD1) generateChunk1(array, x, y, z)
    if (worldName === WORLD2) generateChunk2(array, x, y, z)
}

function generateChunk1(array, cx, cy, cz) {
    var size = array.shape[0]
    if (cy === 0) {
        for (var q = 0; q < size; ++q) array.set(q, 20, 2, 3)
    }
    for (var i = 0; i < size; ++i) {
        var x = cx + i
        for (var k = 0; k < size; ++k) {
            var z = cz + k
            var height = getHeightMap(x, z, 18, 22)
            height += getHeightMap(x, z + 50, 9, 6) / 2
            for (var j = 0; j < size; ++j) {
                var b = decideBlock(x, cy + j, z, height)
                if (b) array.set(i, j, k, b)
            }
            var cloudHt = getCloudHt(x, z, 20, 30)
            if (cloudHt > 0) {
                var cmin = cloudHt - 2 * Math.sin(x / 17)
                var cmax = cloudHt + 3 * Math.sin(z / 22)
                for (j = 0; j < size; ++j) {
                    if (cy + j < cmin || cy + j > cmax) continue
                    array.set(i, j, k, blockIDs.cloud)
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
                if (b === blockIDs.grass) b = blockIDs.stone
                if (b) array.set(i, j, k, b)
            }
        }
    }
}





// helpers

// worldgen - return a heightmap for a given [x,z]
function getHeightMap(x, z, xsize, zsize) {
    var xs = 1.7 * Math.sin(x / xsize)
    var zs = 2.2 * Math.sin(z / zsize)
    var d = Math.sqrt(x * x + z * z)
    return (xs + zs) * Math.min(1, d / 100)
}

function getCloudHt(x, z, xsize, zsize) {
    var xs = 5 + 5 * Math.sin(5 + x / xsize)
    var zs = 6 + 4 * Math.sin(8 + z / zsize - x / 35)
    var ss = 3 + 7 * Math.sin((x + z) / 17)
    return (xs + zs + ss > 20) ? 35 : -1
}

function decideBlock(x, y, z, height) {
    // flat area to north-east for testing
    if (x > 0 && z > 0) {
        var h = 1
        if (z == 40 || x == 40) h = 20
        if (y >= h) return 0
        if (y < 0) return blockIDs.stone
        return blockIDs.green
    }
    // general case
    if (y < height) {
        return (y < -2.2) ? blockIDs.stone :
            (y < 0) ? blockIDs.dirt : blockIDs.grass
    }
    if (y < height + 1 && y > 0) {
        var dens = (y < 1) ? 0.05 : (y < 2) ? 0.1 : 0.2
        if (Math.random() < dens) return blockIDs.grassDeco
    }
    if (y >= 0) return 0
    return blockIDs.water
}



// After the world is initialzed, fill in a bunch of test blocks. 
// There's no particular significance to these, I use them to 
// debug meshing and AO and whatnot

setTimeout(function () {
    addWorldFeatures()
}, 500)

function addWorldFeatures() {
    makeColumn(2, -6, 0, 11, blockIDs.abc2)
    makeColumn(2, -5, 0, 13, blockIDs.transparent)
    makeColumn(2, -4, 0, 15, blockIDs.custom1)
    makeColumn(2, -3, 0, 17, blockIDs.custom2)

    noa.setBlock(blockIDs.stoneTrans, 12, 1, 6)
    noa.setBlock(blockIDs.window, 14, 1, 6)

    makeColumn(2, 14, 1, 10, blockIDs.shinyDirt)

    noa.setBlock(blockIDs.waterPole, -18, -1, 15)
    noa.setBlock(blockIDs.waterPole, -16, -1, 15)
    noa.setBlock(blockIDs.waterPole, -14, -1, 15)

    makeCross(20, 5, 1, 7, 1, blockIDs.pole)
    makeCross(20, 5, 1, 10, 1, blockIDs.pole)
    makeCross(20, 5, 1, 12, 1, blockIDs.pole)

    makeCross(10, 39, 3, 12, 0, blockIDs.pole)
    makeCross(10, 41, 3, 12, 0, blockIDs.pole)
    makeCross(10, 12, 3, 39, 2, blockIDs.pole)
    makeCross(10, 12, 3, 41, 2, blockIDs.pole)
}

function makeColumn(ht, x, y, z, block) {
    for (var i = 0; i < ht; i++) {
        noa.setBlock(block, x, y + i, z)
    }
}

function makeCross(length, x, y, z, axis, block) {
    for (var i = 0; i < length; i++) {
        var px = (axis === 0) ? x : x + i
        var py = (axis === 1) ? y : y + i
        var pz = (axis === 2) ? z : z + i
        noa.setBlock(block, px, py, pz)
        if (axis === 0) py = y + length - i
        if (axis === 1) px = x + length - i
        if (axis === 2) px = x + length - i
        noa.setBlock(block, px, py, pz)
    }
}

