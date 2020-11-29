

import { Mesh } from '@babylonjs/core/Meshes/mesh'
import '@babylonjs/core/Meshes/Builders/boxBuilder'
import '@babylonjs/core/Meshes/Builders/sphereBuilder'


/*
 * 
 *      helpers for setting up entities
 * 
*/


export function setupPlayerEntity(noa) {
    // get the player entity's ID and other info (aabb, size)
    var eid = noa.playerEntity
    var dat = noa.entities.getPositionData(eid)
    var w = dat.width
    var h = dat.height

    // make a Babylon.js mesh and scale it, etc.
    var playerMesh = Mesh.CreateBox('player', 1, noa.rendering.getScene())
    playerMesh.scaling.x = playerMesh.scaling.z = w
    playerMesh.scaling.y = h

    // offset of mesh relative to the entity's "position" (center of its feet)
    var offset = [0, h / 2, 0]

    // a "mesh" component to the player entity
    noa.entities.addComponent(eid, noa.entities.names.mesh, {
        mesh: playerMesh,
        offset: offset
    })
}



export function shootBouncyBall(noa) {
    var ents = noa.entities
    var radius = 0.2

    if (!ballMesh) {
        ballMesh = Mesh.CreateSphere('ball', 6, 2 * radius, noa.rendering.getScene())
    }

    // syntatic sugar for creating a default entity
    var playPos = ents.getPosition(noa.playerEntity)
    var pos = [playPos[0], playPos[1] + 0.5, playPos[2]]
    var width = 2 * radius
    var height = 2 * radius

    var mesh = ballMesh.createInstance('ball_instance')
    var meshOffset = [0, radius, 0]
    var doPhysics = true
    var shadow = true

    var id = noa.entities.add(
        pos, width, height, // required
        mesh, meshOffset, doPhysics, shadow // optional
    )

    // adjust physics body
    var body = ents.getPhysicsBody(id)
    body.restitution = 0.8
    body.friction = 0.7
    var dir = noa.camera.getDirection()
    var imp = []
    for (var i = 0; i < 3; i++) imp[i] = 5 * dir[i]
    imp[1] += 1
    body.applyImpulse(imp)

    // add an entity collision handler, doing fake pseudo physics
    // (physics engine only does entity-terrain collisions, not entity-entity)
    if (!collideHandler) collideHandler = (id, other) => {
        var p1 = ents.getPosition(id)
        var p2 = ents.getPosition(other)
        var imp = []
        for (var i = 0; i < 3; i++) imp[i] = 2 * (p1[i] - p2[i])
        var b = ents.getPhysicsBody(id)
        b.applyImpulse(imp)
    }
    ents.addComponent(id, ents.names.collideEntities, {
        cylinder: true,
        callback: (other) => collideHandler(id, other)
    })


    // add a custom component to remove entities if they get too far away
    if (!removeComp) removeComp = ents.createComponent({
        name: 'remove',
        system: (dt, states) => {
            var p1 = ents.getPosition(noa.playerEntity)
            states.forEach(state => {
                var p2 = ents.getPosition(state.__id)
                var dist = 0
                for (var i = 0; i < 3; i++) dist += Math.abs(p1[i] - p2[i])
                if (dist > 500) ents.deleteEntity(state.__id)
            })
        }
    })
    ents.addComponent(id, removeComp)

}

var ballMesh
var collideHandler
var removeComp

