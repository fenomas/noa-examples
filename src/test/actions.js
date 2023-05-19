
import { noa } from './engine'
import { shootBouncyBall } from './entities'


/*
 * 
 *      interactivity
 * 
*/


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
noa.inputs.bind('pause', 'KeyP')
noa.inputs.down.on('pause', function () {
    paused = !paused
    noa.setPaused(paused)
})
var paused = false



// invert mouse (I)
noa.inputs.bind('invert-mouse', 'KeyI')
noa.inputs.down.on('invert-mouse', function () {
    noa.camera.inverseY = !noa.camera.inverseY
})



// shoot a bouncy ball (1)
noa.inputs.bind('shoot', 'Digit1')
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
noa.inputs.bind('slow', 'Digit3')
noa.inputs.down.on('slow', () => {
    noa.timeScale = [1, 0.1, 2][(++speed) % 3]
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






// for stress testing
window['setViewDistance'] = (blocks = 100) => {
    blocks = (blocks < 50) ? 50 : (blocks > 5000) ? 5000 : blocks
    var xDist = Math.max(1.5, blocks / noa.world._chunkSize)
    var yDist = Math.max(1.5, 0.5 * xDist)
    noa.world.setAddRemoveDistance([xDist, yDist], [xDist + 1, yDist + 1])
}


