
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { Vector3, Matrix } from '@babylonjs/core/Maths/math'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder'
import { CreatePlane } from '@babylonjs/core/Meshes/Builders/planeBuilder'

import { noa } from './engine'
export var blockIDs = {}


/*
 * 
 *		Register a bunch of block types and expose their voxel IDs
 * 
*/

var scene = noa.rendering.getScene()
var reg = noa.registry

// counter to increment for unique block ids
var _id = 1



/**
 * 
 *      Some basic block types
 * 
*/

// blocks that just have a color, with no texture
reg.registerMaterial('greenish', { color: [0.2, 0.5, 0.2] })
reg.registerMaterial('cloud', { color: [0.9, 0.9, 0.92] })

blockIDs.green = reg.registerBlock(_id++, { material: 'greenish' })
blockIDs.cloud = reg.registerBlock(_id++, { material: 'cloud' })


// a solid block with a texture
reg.registerMaterial('stone', { textureURL: 'stone.png' })
blockIDs.stone = reg.registerBlock(_id++, { material: 'stone' })



// blocks with different materials on different block faces
reg.registerMaterial('a', { textureURL: 'a.png' })
reg.registerMaterial('b', { textureURL: 'b.png' })
reg.registerMaterial('c', { textureURL: 'c.png' })

blockIDs.abc1 = reg.registerBlock(_id++, {
    material: ['a', 'b'],  // top/bottom, sides
})
blockIDs.abc2 = reg.registerBlock(_id++, {
    material: ['a', 'b', 'c'],  // top, bottom, sides
})
blockIDs.abc3 = reg.registerBlock(_id++, {
    material: ['a', 'b', 'c', 'a', 'b', 'c',],  // -x, +x, -y, +y, -z, +z
})



// blocks with textures drawn from a (vertical strip) texture atlas
// NOTE: it's recommended to have all your terrain textures in a 
// single atlas, if possible
var textureURL = 'terrain_atlas.png'
reg.registerMaterial('grass', { textureURL, atlasIndex: 0 })
reg.registerMaterial('gside', { textureURL, atlasIndex: 1 })
reg.registerMaterial('dirt', { textureURL, atlasIndex: 2 })
reg.registerMaterial('stone', { textureURL, atlasIndex: 3 })

blockIDs.dirt = reg.registerBlock(_id++, { material: 'dirt' })
blockIDs.grass = reg.registerBlock(_id++, { material: ['grass', 'dirt', 'gside'] })
blockIDs.stone = reg.registerBlock(_id++, { material: 'stone' })



// specify texHasAlpha for partially transparent textures
// (i.e. each texture pixel is either fully opaque or fully transparent)
// note the voxel is declared as non-opaque, meaning that it doesn't 
// fully obscure the face of voxels next to it
reg.registerMaterial('t1', { textureURL: 't1.png', texHasAlpha: true })
reg.registerMaterial('t2', { textureURL: 't2.png', texHasAlpha: true })

blockIDs.transparent = reg.registerBlock(_id++, {
    material: ['t1', 't2'],
    opaque: false,
})



// atlas textures may also have partial transparency
textureURL = 'trans_atlas.png'
var texHasAlpha = true
reg.registerMaterial('stonea', { textureURL, texHasAlpha, atlasIndex: 0 })
reg.registerMaterial('stonec', { textureURL, texHasAlpha, atlasIndex: 2 })
reg.registerMaterial('stonee', { textureURL, texHasAlpha, atlasIndex: 4 })
blockIDs.stoneTrans = reg.registerBlock(_id++, {
    material: ['stonea', 'stonee', 'stonec'],
    opaque: false
})




// blocks with a color and no texture can have a fractional alpha,
// but currently this may composite strangely
reg.registerMaterial('water', { color: [0.5, 0.5, 0.8, 0.7] })
blockIDs.water = reg.registerBlock(_id++, {
    material: 'water',
    fluid: true,
})




// you can also specify your own Babylon material for a block material
var shinyMat = noa.rendering.makeStandardMaterial('shinyDirtMat')
shinyMat.specularColor.copyFromFloats(1, 1, 1)
shinyMat.specularPower = 32
shinyMat.bumpTexture = new Texture('textures/stone.png', scene)
reg.registerMaterial('shinyDirt', {
    color: [0.45, 0.36, 0.22],
    renderMaterial: shinyMat,
})
blockIDs.shinyDirt = reg.registerBlock(_id++, { material: 'shinyDirt' })



// finally, you can register a custom Babylon mesh to represent a voxel
var poleMesh = CreateBox('pole', {}, scene)
var xform = Matrix.Scaling(0.2, 1, 0.2)
xform.setTranslation(new Vector3(0, 0.5, 0))
poleMesh.bakeTransformIntoVertices(xform)
scene.removeMesh(poleMesh)
blockIDs.pole = reg.registerBlock(_id++, {
    blockMesh: poleMesh,
    opaque: false,
    onCustomMeshCreate: function (poleMesh, x, y, z) {
        poleMesh.rotation.y = 123.456 * (x + 32 * z) % (6.28)
    },
})


// second version of the custom block, but underwater
blockIDs.waterPole = reg.registerBlock(_id++, {
    blockMesh: poleMesh,
    solid: true,
    opaque: false,
    material: 'water',
    fluid: true,
})



// Another custom block to test custom meshes with transparent textures
var make = (s) => {
    var testMat = noa.rendering.makeStandardMaterial('voxel_trans_' + s)
    testMat.backFaceCulling = false
    testMat.diffuseTexture = new Texture(`textures/${s}.png`)
    testMat.diffuseTexture.hasAlpha = true

    var testMesh = CreatePlane('cross', {}, scene)
    testMesh.material = testMat
    testMesh.rotation.y += Math.PI / 4
    testMesh.bakeTransformIntoVertices(Matrix.Translation(0, 0.5, 0))
    var clone = testMesh.clone()
    clone.rotation.y += Math.PI / 2
    var result = Mesh.MergeMeshes([testMesh, clone], true)
    return result
}
blockIDs.custom1 = reg.registerBlock(_id++, { blockMesh: make('t1'), opaque: false, })
blockIDs.custom2 = reg.registerBlock(_id++, { blockMesh: make('t2'), opaque: false, })



// terrain blocks with full alpha channels (i.e. texture pixels that are
// partially transparent) don't really currently work, but you can 
// hack them out like this. Note that they may composite strangely.
var tmat = noa.rendering.makeStandardMaterial('windowMat')
tmat.diffuseTexture = new Texture('textures/window.png', scene)
tmat.opacityTexture = tmat.diffuseTexture

reg.registerMaterial('window', { renderMaterial: tmat })
blockIDs.window = reg.registerBlock(_id++, {
    material: 'window',
    opaque: false,
})


