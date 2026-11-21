import * as THREE from "three";
import { GAME_CONFIG } from "./config/gameConfig.js";
import { Game } from "./core/Game.js";
import { SceneManager } from "./core/SceneManager.js";
import { WorldManager } from "./world/WorldManager.js";
import { DistrictStreamer } from "./world/DistrictStreamer.js";
import { DistrictSceneBuilder } from "./world/DistrictSceneBuilder.js";
import { PlayerController } from "./player/PlayerController.js";
import { CameraRig } from "./player/CameraRig.js";
import { VehicleController } from "./vehicles/VehicleController.js";
import { InputManager } from "./systems/InputManager.js";
import { UIManager } from "./ui/UIManager.js";

const mount = document.querySelector("#game");
const hud = document.querySelector("#hud");
const intro = document.querySelector("#intro");
const speedLabel = document.querySelector("#speed");
const vehicleLabel = document.querySelector("#vehicle");
const prompt = document.querySelector("#prompt");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9fc4c5);
scene.fog = new THREE.Fog(0x9fc4c5, 190, 520);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, .1, 900);
const renderer = new THREE.WebGLRenderer({ antialias: GAME_CONFIG.render.antialias, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, GAME_CONFIG.render.maxPixelRatio));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.add(new THREE.HemisphereLight(0xdff4ff, 0x77634a, 2.1));
const sun = new THREE.DirectionalLight(0xffe8c7, 2.0);
sun.position.set(-80, 120, 65);
scene.add(sun);

const sceneManager = new SceneManager({ scene, camera, renderer, mount });
const input = new InputManager();
const ui = new UIManager({ onScreenChange: screen => document.body.dataset.screen = screen });
const builder = new DistrictSceneBuilder(scene);
const world = new WorldManager({
  activeRadius: GAME_CONFIG.world.activeDistrictRadius,
  cellLoader: cell => builder.build(cell),
  cellDisposer: resource => builder.dispose(resource)
});
const game = new Game({ sceneManager, inputManager: input, worldManager: world, uiManager: ui });
const streamer = new DistrictStreamer(world, { loadRadius: 1.35, unloadRadius: 2.1 });
const player = new PlayerController({ moveSpeed: 8 });
player.position.x = 125;
player.position.z = 125;
playerMesh.position.set(125,0,125);
const cameraRig = new CameraRig({ distance: 9, height: 5, lookHeight: 1.3 });
const vehicle = new VehicleController({ maxSpeed: 36, acceleration: 17, braking: 26 });

const playerMesh = new THREE.Group();
const body = new THREE.Mesh(new THREE.CapsuleGeometry(.48,.85,3,7), new THREE.MeshStandardMaterial({ color: 0xd9a978, roughness: .9 }));
body.position.y = 1.1;
const head = new THREE.Mesh(new THREE.SphereGeometry(.3,8,6), new THREE.MeshStandardMaterial({ color: 0x93674e }));
head.position.y = 2.05;
playerMesh.add(body,head);
scene.add(playerMesh);

const carMesh = new THREE.Group();
const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.1,.72,4.1), new THREE.MeshStandardMaterial({ color: 0x237364, roughness: .55 }));
carBody.position.y = .78;
const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.65,.78,1.95), new THREE.MeshStandardMaterial({ color: 0x71939a, roughness: .3, metalness: .12 }));
cabin.position.set(0,1.42,-.18);
carMesh.add(carBody,cabin);
for (const x of [-1,1]) for (const z of [-1.32,1.32]) {
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.2,10), new THREE.MeshStandardMaterial({ color: 0x182124 }));
  wheel.rotation.z = Math.PI/2;
  wheel.position.set(x,.42,z);
  carMesh.add(wheel);
}
carMesh.position.set(129,0,129);
carMesh.visible = false;
scene.add(carMesh);

const garageMarker = new THREE.Mesh(new THREE.TorusGeometry(2.4,.16,7,28), new THREE.MeshStandardMaterial({ color: 0x65e3a2, emissive: 0x124c30 }));
garageMarker.rotation.x = Math.PI/2;
garageMarker.position.set(129,.25,129);
scene.add(garageMarker);

const keyMap = { w:"forward", s:"back", a:"left", d:"right", shift:"sprint" };
function keyboardAction(key) {
  if (vehicle.state === "occupied") {
    return ({ w:"throttle", arrowup:"throttle", s:"brake", arrowdown:"brake", a:"steerLeft", arrowleft:"steerLeft", d:"steerRight", arrowright:"steerRight" })[key];
  }
  return keyMap[key] || ({ arrowup:"forward", arrowdown:"back", arrowleft:"left", arrowright:"right" })[key];
}
addEventListener("keydown", event => {
  const action = keyboardAction(event.key.toLowerCase());
  if (action) input.setAction(action,true);
  if (event.key.toLowerCase()==="e") toggleVehicle();
  if (event.key==="Escape") { ui.show("pause"); document.querySelector("#pause").classList.remove("hidden"); }
});
addEventListener("keyup", event => {
  const action = keyboardAction(event.key.toLowerCase());
  if (action) input.setAction(action,false);
});
document.querySelectorAll("[data-action]").forEach(button => {
  const action = button.dataset.action;
  button.addEventListener("pointerdown", event => { event.preventDefault(); input.setAction(action,true); });
  for (const type of ["pointerup","pointercancel","pointerleave"]) button.addEventListener(type, () => input.setAction(action,false));
});

function toggleVehicle() {
  if (vehicle.state !== "occupied") {
    if (playerMesh.position.distanceTo(carMesh.position) > 7) {
      prompt.textContent = "Garage marker ke paas jaakar vehicle enter karo.";
      return;
    }
    vehicle.enter("city-runner");
    playerMesh.visible = false;
    carMesh.visible = true;
    vehicleLabel.textContent = "CITY RUNNER";
    document.querySelector("#enter").textContent = "EXIT";
    document.querySelector("#walkControls").classList.add("hidden");
    document.querySelector("#driveControls").classList.remove("hidden");
    prompt.textContent = "Drive: GAS / BRAKE / LEFT / RIGHT";
  } else {
    vehicle.exit();
    playerMesh.position.copy(carMesh.position).add(new THREE.Vector3(3,0,0));
    playerMesh.visible = true;
    carMesh.visible = false;
    vehicleLabel.textContent = "ON FOOT";
    document.querySelector("#enter").textContent = "ENTER";
    document.querySelector("#walkControls").classList.remove("hidden");
    document.querySelector("#driveControls").classList.add("hidden");
    prompt.textContent = "WASD / ARROWS se explore karo. E = vehicle.";
  }
}
document.querySelector("#enter").addEventListener("click",toggleVehicle);
document.querySelector("#play").addEventListener("click", async () => {
  intro.classList.add("hidden");
  hud.classList.remove("hidden");
  await game.start();
  game.enterWorld();
  ui.showHUD();
  await streamer.update(player.position);
  if (matchMedia("(orientation: portrait)").matches) document.querySelector("#rotate").classList.remove("hidden");
  else document.querySelector("#rotate").classList.add("hidden");
});
document.querySelector("#resume").addEventListener("click",() => { document.querySelector("#pause").classList.add("hidden"); ui.showHUD(); });
document.querySelector("#pauseButton").addEventListener("click",() => { document.querySelector("#pause").classList.remove("hidden"); ui.show("pause"); });
document.querySelector("#rotateClose").addEventListener("click",() => document.querySelector("#rotate").classList.add("hidden"));

let last = performance.now();
let streamTimer = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min((now-last)/1000,.04);
  last = now;
  if (game.state === "playing") {
    if (vehicle.state === "occupied") {
      const vInput = {
        throttle: input.isPressed("throttle"),
        brake: input.isPressed("brake"),
        steer: Number(input.isPressed("steerRight")) - Number(input.isPressed("steerLeft"))
      };
      const speed = vehicle.update(vInput,dt);
      carMesh.rotation.y = vehicle.heading;
      carMesh.position.x += Math.sin(vehicle.heading)*speed*dt;
      carMesh.position.z += Math.cos(vehicle.heading)*speed*dt;
      carMesh.position.x = THREE.MathUtils.clamp(carMesh.position.x,-118,118);
      carMesh.position.z = THREE.MathUtils.clamp(carMesh.position.z,-118,118);
      speedLabel.textContent = Math.round(Math.abs(speed));
      follow(carMesh.position,vehicle.heading);
    } else {
      const p = player.update(input.getPlayerInput(),dt);
      playerMesh.position.set(p.x,0,p.z);
      playerMesh.rotation.y = player.heading;
      follow(playerMesh.position,player.heading);
      speedLabel.textContent = "0";
    }
    streamTimer += dt;
    if (streamTimer > .6) {
      streamTimer = 0;
      const pos = vehicle.state === "occupied" ? carMesh.position : playerMesh.position;
      streamer.update(pos).catch(error => console.error("District streaming:",error));
    }
  }
  renderer.render(scene,camera);
}
function follow(position,heading) {
  const target = cameraRig.getTarget(position,heading);
  camera.position.lerp(new THREE.Vector3(target.x,target.y,target.z),.09);
  camera.lookAt(target.lookAt.x,target.lookAt.y,target.lookAt.z);
}
requestAnimationFrame(frame);

addEventListener("resize",() => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  sceneManager.resize(innerWidth,innerHeight);
});
document.addEventListener("visibilitychange",() => { if (document.hidden) input.clear(); });
