

import { shootBouncyBall } from './entities'


/*
 * 
 *      interactivity
 * 
*/


/** @param {import("noa-engine").Engine} noa */
export function setupInteractions(noa) {

    // on left mouse, set targeted block to be air
    noa.inputs.down.on('fire', function () {
        if (noa.targetedBlock) {
            var pos = noa.targetedBlock.position
            noa.setBlock(0, pos[0], pos[1], pos[2])
        }
    })


    // place block on alt-fire (RMB/E)
    var pickedID = 1
    noa.inputs.down.on('alt-fire', function () {
        if (noa.targetedBlock) {
            var pos = noa.targetedBlock.adjacent
            noa.addBlock(pickedID, pos[0], pos[1], pos[2])
        }
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



    // invert mouse (I)
    noa.inputs.bind('invert-mouse', 'I')
    noa.inputs.down.on('invert-mouse', function () {
        noa.camera.inverseY = !noa.camera.inverseY
    })



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



    // testing timeScale
    var speed = 0
    noa.inputs.bind('slow', '3')
    noa.inputs.down.on('slow', () => {
        noa.timeScale = [1, 0.1, 2][(++speed) % 3]
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



}

