

import { shootBouncyBall } from './entities'
import '@babylonjs/core/Debug/debugLayer'


/*
 * 
 *      interactivity
 * 
*/


export function setupInteractions(noa) {

    // on left mouse, set targeted block to be air
    noa.inputs.down.on('fire', function () {
        if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position)
    })


    // place block on alt-fire (RMB/E)
    var pickedID = 1
    noa.inputs.down.on('alt-fire', function () {
        if (noa.targetedBlock) noa.addBlock(pickedID, noa.targetedBlock.adjacent)
    })


    // pick block on middle fire (MMB/Q)
    noa.inputs.down.on('mid-fire', function () {
        if (noa.targetedBlock) pickedID = noa.targetedBlock.blockID
    })


    // pause (P)
    noa.inputs.bind('pause', 'P')
    noa.inputs.down.on('pause', function () {
        paused = !paused
        noa.setPaused(paused)
    })
    var paused = false


    // shoot a bouncy ball (1)
    noa.inputs.bind('shoot', '1')
    var shoot = () => shootBouncyBall(noa)
    var interval, timeout
    noa.inputs.down.on('shoot', function () {
        shoot()
        timeout = setTimeout(() => {
            interval = setInterval(shoot, 50)
        }, 400)
    })
    noa.inputs.up.on('shoot', function () {
        clearTimeout(timeout)
        clearInterval(interval)
    })


    // each tick, consume any scroll events and use them to zoom camera
    noa.on('tick', function (dt) {
        var scroll = noa.inputs.state.scrolly
        if (scroll !== 0) {
            noa.camera.zoomDistance += (scroll > 0) ? 1 : -1
            if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0
            if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10
        }
    })


    // launch Babylon debug layer when pressing "Z"
    var debug = false
    var scene = noa.rendering.getScene()
    noa.inputs.bind('debug', 'Z')
    noa.inputs.down.on('debug', () => {
        // inspector is very heavy, so load it via dynamic import
        import('@babylonjs/inspector').then(data => {
            debug = !debug
            if (debug) scene.debugLayer.show()
            else scene.debugLayer.hide()
        })
    })


}

