
import { noa } from './engine'

import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent'
import '@babylonjs/core/Rendering/depthRendererSceneComponent'
import { CascadedShadowGenerator } from '@babylonjs/core/Lights/Shadows/cascadedShadowGenerator'



/**
 * 
 * 
 *      Example of one way to add Babylon.js shadows to a scene
 * 
 * 
 */

var scene = noa.rendering.scene
var light = noa.rendering.light
var camera = noa.rendering.camera

// change lighting so shadows show up better
light.diffuse.set(0.7, 0.7, 0.7)
scene.ambientColor.set(0.3, 0.3, 0.3)

// basic shadow generator
var gen = new CascadedShadowGenerator(1024, light, false, camera)
var shadowDist = 100
gen.shadowMaxZ = shadowDist
gen.forceBackFacesOnly = true
gen.transparencyShadow = false
gen.lambda = 0.7
gen.darkness = 0.4
window['gen'] = gen







// listener to hear when terrain or block meshes are added/removed
noa.on('addingTerrainMesh', (mesh) => {
    setMeshShadows(mesh, true)
})
noa.on('removingTerrainMesh', (mesh) => {
    setMeshShadows(mesh, false)
})





// handler to add/remove shadows to a mesh
export function setMeshShadows(mesh, shadows = false) {
    if (!mesh.metadata) mesh.metadata = {}

    var hasShadows = !!mesh.metadata[HAS_SHADOWS]
    if (shadows === hasShadows) return
    if (shadows) {
        gen.addShadowCaster(mesh, true)
        if (!mesh.isAnInstance) mesh.receiveShadows = true
        mesh.metadata[HAS_SHADOWS] = true
        mesh.resetDrawCache()

    } else {
        gen.removeShadowCaster(mesh, true)
        if (!mesh.isAnInstance) mesh.receiveShadows = false
        mesh.metadata[HAS_SHADOWS] = false
    }
}
var HAS_SHADOWS = 'noa_demo_has_shadows'


