export function setupFog(noa, fogMode, fogDensity, fogStart, fogEnd, fogColor){
  var BABYLON = require("@babylonjs/core/Legacy/legacy")
  var scene = noa.rendering.getScene()
  scene.fogMode = fogMode
  scene.fogDensity = fogDensity
  scene.fogStart = fogStart
  scene.fogEnd = fogEnd
  scene.fogColor = new BABYLON.Color3(fogColor[0],fogColor[1],fogColor[2])
}
