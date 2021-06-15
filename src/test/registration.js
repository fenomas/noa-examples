
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { Vector3, Matrix } from '@babylonjs/core/Maths/math'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import '@babylonjs/core/Meshes/Builders/boxBuilder'




/*
 * 
 *		Register a bunch of blocks and materials and whatnot
 * 
*/

export function initRegistration(noa) {

    // block materials
    var brownish = [0.45, 0.36, 0.22]
    var greenish = [0.1, 0.8, 0.2]
    var greenish2 = [0.1, 0.6, 0.2]
    noa.registry.registerMaterial('grass', greenish, null)
    noa.registry.registerMaterial('grass2', greenish2, null)
    noa.registry.registerMaterial('dirt', brownish, null, false)
    var strs = ['a', 'b', 'c', 'd', '1', '2']
    for (var i = 0; i < 6; i++) {
        var s = strs[i]
        noa.registry.registerMaterial(s, null, s + '.png')
        noa.registry.registerMaterial('t' + s, null, 't' + s + '.png', true)
    }
    noa.registry.registerMaterial('water', [0.5, 0.5, 0.8, 0.7], null)
    noa.registry.registerMaterial('water2', [0.5, 0.5, 0.8, 0.7], null)



    // do some Babylon.js stuff with the scene, materials, etc.
    var scene = noa.rendering.getScene()

    // register a block material with a transparent texture
    // noa.registry.registerMaterial('window', brownish, 'window.png', true)

    var tmat = noa.rendering.makeStandardMaterial('')
    tmat.diffuseTexture = new Texture('textures/window.png', scene)
    tmat.opacityTexture = tmat.diffuseTexture
    noa.registry.registerMaterial('window', null, null, false, tmat)

    // register a shinyDirt block with a custom render material
    var shinyMat = noa.rendering.makeStandardMaterial('shinyDirtMat')
    shinyMat.specularColor.copyFromFloats(1, 1, 1)
    shinyMat.specularPower = 32
    shinyMat.bumpTexture = new Texture('textures/stone.png', scene)
    noa.registry.registerMaterial('shinyDirt', brownish, null, false, shinyMat)


    // object block mesh
    var mesh = Mesh.CreateBox('post', 1, scene)
    var mat = Matrix.Scaling(0.2, 1, 0.2)
    mat.setTranslation(new Vector3(0, 0.5, 0))
    mesh.bakeTransformIntoVertices(mat)
    scene.removeMesh(mesh)


    // block types registration
    var blockIDs = {}
    var _id = 1

    blockIDs.dirtID = noa.registry.registerBlock(_id++, { material: 'dirt' })
    blockIDs.shinyDirtID = noa.registry.registerBlock(_id++, { material: 'shinyDirt' })
    blockIDs.grassID = noa.registry.registerBlock(_id++, { material: 'grass' })
    blockIDs.grass2ID = noa.registry.registerBlock(_id++, { material: 'grass2' })
    blockIDs.testID1 = noa.registry.registerBlock(_id++, { material: ['b', 'd', '1', '2', 'c', 'a'] })
    blockIDs.windowID = noa.registry.registerBlock(_id++, {
        material: 'window',
        opaque: false,
    })
    blockIDs.testID2 = noa.registry.registerBlock(_id++, {
        material: ['tb', 'td', 't1', 't2', 'tc', 'ta'],
        opaque: false,
    })
    blockIDs.testID3 = noa.registry.registerBlock(_id++, { material: ['1', '2', 'a'] })
    blockIDs.waterID = noa.registry.registerBlock(_id++, {
        material: 'water',
        fluid: true
    })
    blockIDs.water2ID = noa.registry.registerBlock(_id++, {
        material: 'water2',
        fluid: true
    })
    blockIDs.customID = noa.registry.registerBlock(_id++, {
        blockMesh: mesh,
        opaque: false,
        onCustomMeshCreate: function (mesh, x, y, z) {
            mesh.rotation.y = ((x + 0.234) * 1.234 + (z + 0.567) * 6.78) % (2 * Math.PI)
        },
    })

    blockIDs.waterPole = noa.registry.registerBlock(_id++, {
        blockMesh: mesh,
        solid: true,
        opaque: false,
        material: 'water',
        fluid: true,
    })



    var make = (s) => {
        var testMat = noa.rendering.makeStandardMaterial('')
        testMat.backFaceCulling = false
        testMat.diffuseTexture = new Texture('textures/' + s + '.png')
        testMat.diffuseTexture.hasAlpha = true
        window.t = testMat

        var testMesh = Mesh.CreatePlane('cross:' + s, 1, scene)
        testMesh.material = testMat
        testMesh.rotation.x += Math.PI
        testMesh.rotation.y += Math.PI / 4
        let offset = Matrix.Translation(0, -0.5, 0)
        testMesh.bakeTransformIntoVertices(offset)
        let clone = testMesh.clone()
        clone.rotation.y += Math.PI / 2
        var result = Mesh.MergeMeshes([testMesh, clone], true)
        return result
    }

    blockIDs.testa = noa.registry.registerBlock(_id++, {
        blockMesh: make('ta'),
        opaque: false,
    })

    blockIDs.testb = noa.registry.registerBlock(_id++, {
        blockMesh: make('tb'),
        opaque: false,
    })

    blockIDs.testc = noa.registry.registerBlock(_id++, {
        blockMesh: make('tc'),
        opaque: false,
    })




    return blockIDs
}


