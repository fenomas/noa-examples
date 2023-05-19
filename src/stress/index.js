
/* 
 * 
 *          noa stress test
 * 
 *  a plain world with long view distances and mixed terrain types
 * 
*/

import { Engine } from 'noa-engine'
import { Vector3 } from '@babylonjs/core/Maths/math'


var noa = new Engine({
    debug: true,
    showFPS: true,
    inverseY: true,
    chunkSize: 48,
    chunkAddDistance: [8.5, 6],
    playerStart: [0, 10, 0],
    playerAutoStep: true,
    playerShadowComponent: false,
    originRebaseDistance: 10,
})



// registration
import atlasURL from '../textures/terrain_atlas.png'
noa.registry.registerMaterial('grass', { textureURL: atlasURL, atlasIndex: 0 })
noa.registry.registerMaterial('g_dirt', { textureURL: atlasURL, atlasIndex: 1 })
noa.registry.registerMaterial('dirt', { textureURL: atlasURL, atlasIndex: 2 })
noa.registry.registerMaterial('stone', { textureURL: atlasURL, atlasIndex: 3 })
noa.registry.registerMaterial('stone2', { textureURL: atlasURL, atlasIndex: 4 })
// noa.registry.registerMaterial('cloud', { textureURL: atlasURL, atlasIndex: 5 })
noa.registry.registerMaterial('cloud', { color: [1, 1, 1, 0.4] })


var id = 1
var dirt = noa.registry.registerBlock(id++, { material: 'dirt' })
var grass = noa.registry.registerBlock(id++, { material: ['grass', 'dirt', 'g_dirt'] })
var stone = noa.registry.registerBlock(id++, { material: 'stone' })
var stone2 = noa.registry.registerBlock(id++, { material: 'stone2' })
var cloud = noa.registry.registerBlock(id++, { material: 'cloud' })


// worldgen
var decideVoxel = (x, y, z, ht, clo, chi, pillar) => {
    if (y < ht) {
        if (y < -1.8) return stone
        if (y < 1.2) return dirt
        return (ht - y < 1) ? grass : dirt
    }
    if (y < ht + pillar) return stone2
    if (y > clo && y < chi) return cloud
    if (y === 15 && x === -20) return stone
    return 0
}
noa.world.on('worldDataNeeded', (requestID, data, cx, cy, cz) => {
    // fast cases when very high/low
    if (cy > 40 || cy < -20) {
        var monoID = (cy > 0) ? 0 : stone
        return noa.world.setChunkData(requestID, data, null, monoID)
    }

    for (var i = 0; i < data.shape[0]; i++) {
        var x = cx + i
        for (var k = 0; k < data.shape[2]; k++) {
            var z = cz + k
            var ht = Math.sqrt(x * x + z * z) / 100
            var a = noise(x, 150)
            var b = noise(z + 50, 140)
            var c = noise(x - z - 50, 120)
            ht += 2 * a + b + c
            var pillar = (Math.random() < 0.002) ? 5 : 0
            var clo = 39 + 2 * (b - c)
            var chi = 35 + 2 * (a - b)
            for (var j = 0; j < data.shape[1]; j++) {
                var y = cy + j
                var id = decideVoxel(x, y, z, ht, clo, chi, pillar)
                data.set(i, j, k, id)
            }
        }
    }
    // tell noa the chunk's terrain data is now set
    noa.world.setChunkData(requestID, data)
})





/*
 * 
 *      Minimal interactivity 
 * 
*/

// clear targeted block on on left click
noa.inputs.down.on('fire', function () {
    if (noa.targetedBlock) {
        var pos = noa.targetedBlock.position
        noa.setBlock(0, pos[0], pos[1], pos[2])
    }
})

// each tick, consume any scroll events and use them to zoom camera
noa.on('tick', function (dt) {
    var scroll = noa.inputs.pointerState.scrolly
    if (scroll !== 0) {
        noa.camera.zoomDistance += (scroll > 0) ? 1 : -1
        if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0
        if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10
    }
})


// pause (P)
noa.inputs.bind('pause', 'KeyP')
noa.inputs.down.on('pause', function () {
    paused = !paused
    noa.setPaused(paused)
})
var paused = false




// import 'babylonjs-inspector'
// import { DebugLayer } from '@babylonjs/core/'
// noa.inputs.bind('debugLayer', 'KeyZ')
// noa.inputs.down.on('debugLayer', function () {
//     noa.rendering.getScene().debugLayer.show({
//         initialTab: 2,
//     })
// })




window['setViewDistance'] = (blocks = 100) => {
    blocks = (blocks < 50) ? 50 : (blocks > 5000) ? 5000 : blocks
    var xDist = Math.max(1.5, blocks / noa.world._chunkSize)
    var yDist = Math.max(1.5, 0.5 * xDist)
    noa.world.setAddRemoveDistance([xDist, yDist], [xDist + 1, yDist + 1])
}






/**
 * 
 *      shadow stress test...
 * 
 */

import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent'
import '@babylonjs/core/Rendering/depthRendererSceneComponent'
import { CascadedShadowGenerator } from '@babylonjs/core/Lights/Shadows/cascadedShadowGenerator'

var light = noa.rendering.light
var camera = noa.rendering.camera
var gen = new CascadedShadowGenerator(1024, light, false, camera)
window['gen'] = gen

var shadowDist = 100
gen.shadowMaxZ = shadowDist
gen.forceBackFacesOnly = true
gen.lambda = 0.7
gen.filteringQuality = CascadedShadowGenerator.QUALITY_MEDIUM
gen.transparencyShadow = false
gen.darkness = 0.5

// perf tweaks - these may or may not be robust!
gen.autoCalcDepthBounds = false
gen.freezeShadowCastersBoundingInfo = true
gen.shadowCastersBoundingInfo.reConstruct(
    new Vector3(-shadowDist, -shadowDist, -shadowDist),
    new Vector3(shadowDist, shadowDist, shadowDist)
)


// listener to hear when terrain or block meshes are added/removed
noa.on('addingTerrainMesh', (mesh) => {
    setMeshShadows(mesh)
})
noa.off('addingTerrainMesh', (mesh) => {
    setMeshShadows(mesh, true)
})


// handler to add/remove shadows to a mesh
export function setMeshShadows(mesh, forceRemove = false) {
    if (!mesh.metadata) mesh.metadata = {}
    var hasShadows = !!mesh.metadata.noa_demo_has_shadows
    var needShadows = (forceRemove) ? false :
        (mesh.position.length() < shadowDist)
    if (needShadows === hasShadows) return
    if (needShadows) {
        gen.addShadowCaster(mesh, true)
        if (!mesh.isAnInstance) mesh.receiveShadows = true
    } else {
        gen.removeShadowCaster(mesh, true)
        if (!mesh.isAnInstance) mesh.receiveShadows = false
    }
    mesh.metadata.noa_demo_has_shadows = needShadows
    mesh.resetDrawCache()
}


var checkIx = 0
noa.on('tick', () => {
    var meshes = noa.rendering.scene.meshes
    var ct = Math.min(30, meshes.length / 4)
    for (var i = 0; i < ct; i++) {
        if (checkIx >= meshes.length) checkIx = 0
        setMeshShadows(meshes[checkIx++])
    }
})







// player mesh
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder'
var mesh = CreateBox('player-mesh', {}, noa.rendering.getScene())
var dat = noa.entities.getPositionData(noa.playerEntity)
mesh.scaling.x = mesh.scaling.z = dat.width
mesh.scaling.y = dat.height
mesh.material = noa.rendering.makeStandardMaterial()
noa.entities.addComponent(noa.playerEntity, noa.entities.names.mesh, {
    mesh: mesh,
    offset: [0, dat.height / 2, 0],
})


// other tweaks
var move = noa.entities.getMovement(noa.playerEntity)
move.maxSpeed = 50
move.moveForce = 60



// performant helper
function noise(x, scale) {
    var nx = x / scale
    var ix = nx - Math.floor(nx)
    return _noiseVals[(ix * 1000) | 0]
}
var _r = [0, 0, 0].map(Math.random)
var _noiseVals = Array.from(Array(1000)).map((_, i) => {
    var x = Math.cos(Math.PI * 2 * (i / 1000 + _r[0]))
    x += 0.5 * Math.cos(Math.PI * 2 * (i / 500 + _r[1]))
    x += 0.25 * Math.cos(Math.PI * 2 * (i / 250 + _r[2]))
    return x
})