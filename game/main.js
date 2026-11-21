import * as THREE from "three";
import { GAME_CONFIG } from "./config/gameConfig.js";
import { Game } from "./core/Game.js";
import { SceneManager } from "./core/SceneManager.js";
import { WorldManager } from "./world/WorldManager.js";
import { DistrictStreamer } from "./world/DistrictStreamer.js";
import { DistrictSceneBuilder } from "./world/DistrictSceneBuilder.js";
import { WorldCollision } from "./world/WorldCollision.js";
import { PlayerController } from "./player/PlayerController.js";
import { CameraRig } from "./player/CameraRig.js";
import { VehicleController } from "./vehicles/VehicleController.js";
import { InputManager } from "./systems/InputManager.js";
import { UIManager } from "./ui/UIManager.js";
import { MissionManager } from "./systems/MissionManager.js";
import { NavigationManager } from "./systems/NavigationManager.js";
import { PerformanceMonitor } from "./systems/PerformanceMonitor.js";
import { OrientationManager } from "./systems/OrientationManager.js";

const mount = document.querySelector("#game");
const hud = document.querySelector("#hud");
const intro = document.querySelector("#intro");
const speedLabel = document.querySelector("#speed");
const vehicleLabel = document.querySelector("#vehicle");
const prompt = document.querySelector("#prompt");
const mapCanvas = document.querySelector("#minimap");
const mapContext = mapCanvas.getContext("2d");
const missionObjective = document.querySelector("#missionObjective");
const missionDistance = document.querySelector("#missionDistance");
const missionTitle = document.querySelector("#missionTitle");

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
const streamer = new DistrictStreamer(world, { loadRadius: .95, unloadRadius: 1.3 });
const collision = new WorldCollision(world);
const missions = new MissionManager();
const navigation = new NavigationManager();
const performanceMonitor = new PerformanceMonitor(90);
const orientation = new OrientationManager(isLandscape => {
  if (game.state === "playing") document.querySelector("#rotate").classList.toggle("hidden", isLandscape);
});
missions.register({
  id:"city-explorer", type:"exploration", title:"CITY EXPLORER",
  objectives:[
    { id:"downtown-plaza", label:"Visit Downtown Skyline Plaza", x:125, z:47, waypointLabel:"Skyline Plaza" },
    { id:"marina-promenade", label:"Drive to Marina Promenade", x:455, z:210, waypointLabel:"Marina Promenade" },
    { id:"highway-viewpoint", label:"Reach the Highway Viewpoint", x:125, z:375, waypointLabel:"Highway Viewpoint" },
    { id:"desert-oasis", label:"Finish at Desert Oasis", x:-125, z:125, waypointLabel:"Desert Oasis" }
  ]
});
missions.start("city-explorer");
navigation.setWaypoint({ x:125, z:47, label:"Skyline Plaza" });
const player = new PlayerController({ moveSpeed: 8 });
player.position.x = 125;
player.position.z = 125;
const cameraRig = new CameraRig({ distance: 9, height: 5, lookHeight: 1.3 });
const vehicle = new VehicleController({ maxSpeed: 120, reverseSpeed: 18, acceleration: 42, braking: 90, steeringRate: 1.8 });

const playerMesh = new THREE.Group();
const body = new THREE.Mesh(new THREE.CapsuleGeometry(.48,.85,3,7), new THREE.MeshStandardMaterial({ color: 0xd9a978, roughness: .9 }));
body.position.y = 1.1;
const head = new THREE.Mesh(new THREE.SphereGeometry(.3,8,6), new THREE.MeshStandardMaterial({ color: 0x93674e }));
head.position.y = 2.05;
playerMesh.add(body,head);
scene.add(playerMesh);
playerMesh.position.set(125,0,125);

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
  if (event.key==="Escape" && game.state === "playing") { game.pause(); input.clear(); document.querySelector("#pause").classList.remove("hidden"); }
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

function isInsideWorld(position, margin = 0) {
  return world.cells.some(cell => position.x >= cell.origin[0]+margin && position.x <= cell.origin[0]+cell.size-margin && position.z >= cell.origin[1]+margin && position.z <= cell.origin[1]+cell.size-margin);
}

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
  await orientation.requestLandscape();
  orientation.start();
  await game.start();
  game.enterWorld();
  ui.showHUD();
  await streamer.update(player.position);
  document.querySelector("#rotate").classList.toggle("hidden", orientation.isLandscape());
});
document.querySelector("#resume").addEventListener("click",() => { document.querySelector("#pause").classList.add("hidden"); game.resume(); ui.showHUD(); });
document.querySelector("#pauseButton").addEventListener("click",() => { if (game.state === "playing") { game.pause(); input.clear(); document.querySelector("#pause").classList.remove("hidden"); } });
document.querySelector("#rotateClose").addEventListener("click",() => document.querySelector("#rotate").classList.add("hidden"));

let last = performance.now();
let streamTimer = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min((now-last)/1000,.04);
  last = now;
  performanceMonitor.record(dt);
  if (game.state === "playing") {
    if (vehicle.state === "occupied") {
      const vInput = {
        throttle: input.isPressed("throttle"),
        brake: input.isPressed("brake"),
        steer: Number(input.isPressed("steerRight")) - Number(input.isPressed("steerLeft"))
      };
      const previousCarPosition = carMesh.position.clone();
      const speed = vehicle.update(vInput,dt);
      carMesh.rotation.y = vehicle.heading;
      const travelMeters = (speed / 3.6) * dt;
      carMesh.position.x += Math.sin(vehicle.heading)*travelMeters;
      carMesh.position.z += Math.cos(vehicle.heading)*travelMeters;
      carMesh.position.x = THREE.MathUtils.clamp(carMesh.position.x,-248,498);
      carMesh.position.z = THREE.MathUtils.clamp(carMesh.position.z,2,498);
      if (!isInsideWorld(carMesh.position,1.6)) carMesh.position.copy(previousCarPosition);
      if (collision.resolve(carMesh.position, previousCarPosition, 1.6)) vehicle.speed = 0;
      speedLabel.textContent = Math.round(Math.abs(speed));
      follow(carMesh.position,vehicle.heading);
    } else {
      const previousPlayerPosition = { ...player.position };
      const p = player.update(input.getPlayerInput(),dt);
      p.x = THREE.MathUtils.clamp(p.x,-248,498);
      p.z = THREE.MathUtils.clamp(p.z,2,498);
      if (!isInsideWorld(p,.65)) { p.x = previousPlayerPosition.x; p.z = previousPlayerPosition.z; }
      collision.resolve(p, previousPlayerPosition, .65);
      playerMesh.position.set(p.x,0,p.z);
      playerMesh.rotation.y = player.heading;
      follow(playerMesh.position,player.heading);
      speedLabel.textContent = "0";
    }
    const activePosition = vehicle.state === "occupied" ? carMesh.position : playerMesh.position;
    updateMission(activePosition);
    updateDistrictLabel(activePosition);
    drawMinimap(activePosition, vehicle.state === "occupied" ? vehicle.heading : player.heading);
    streamTimer += dt;
    if (streamTimer > .6) {
      streamTimer = 0;
      const pos = vehicle.state === "occupied" ? carMesh.position : playerMesh.position;
      streamer.update(pos).catch(error => console.error("District streaming:",error));
    }
  }
  renderer.render(scene,camera);
}
function updateMission(position) {
  const distance = navigation.distanceFrom(position);
  if (distance === null) return;
  missionDistance.textContent = `${Math.round(distance)} m away`;
  if (distance <= 9) {
    const completed = missions.getCurrentObjective();
    const state = missions.completeObjective();
    if (!state) return;
    if (state.status === "complete") {
      navigation.discover(completed.id);
      navigation.clearWaypoint();
      missionTitle.textContent = "CITY EXPLORER COMPLETE";
      missionObjective.textContent = "All four city destinations visited";
      missionDistance.textContent = "4 / 4 objectives complete";
      prompt.textContent = "Mission complete! City Explorer finished.";
    } else {
      navigation.discover(completed.id);
      const next = missions.getCurrentObjective();
      navigation.setWaypoint({ x:next.x, z:next.z, label:next.waypointLabel || next.label });
      missionTitle.textContent = "CITY EXPLORER";
      missionObjective.textContent = next.label;
      prompt.textContent = `Objective complete: ${completed.label}`;
    }
  }
}
function updateDistrictLabel(position) {
  const cell = world.cells.find(item => position.x >= item.origin[0] && position.x <= item.origin[0]+item.size && position.z >= item.origin[1] && position.z <= item.origin[1]+item.size);
  const district = cell ? world.getDistrict(cell.districtId) : null;
  const label = document.querySelector("#districtName");
  if (label) label.textContent = district ? district.name.toUpperCase() : "CITY OUTSKIRTS";
}
function drawMinimap(position, heading) {
  const ctx = mapContext;
  const w = mapCanvas.width, h = mapCanvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "#1e3033"; ctx.fillRect(0,0,w,h);
  const pad = 18, minX = -250, scale = (w-pad*2)/750;
  const mapHeight = 500*scale, top = (h-mapHeight)/2;
  for (const cell of world.cells) {
    const x0 = pad + (cell.origin[0]-minX)*scale;
    const z0 = top + cell.origin[1]*scale;
    ctx.fillStyle = cell.districtId === "marina" ? "#36585a" : cell.districtId === "desert" ? "#776748" : cell.districtId === "highway" ? "#4b5350" : "#3e4d4c";
    ctx.fillRect(x0,z0,cell.size*scale,cell.size*scale);
    ctx.strokeStyle = "#8d9c91"; ctx.lineWidth = 1.5;
    ctx.strokeRect(x0,z0,cell.size*scale,cell.size*scale);
    ctx.strokeStyle = "#b5c2b3"; ctx.lineWidth = 13*scale;
    for (const offset of [60,125,190]) {
      const roadY = z0 + offset*scale;
      const roadX = x0 + offset*scale;
      ctx.beginPath(); ctx.moveTo(x0,roadY); ctx.lineTo(x0+cell.size*scale,roadY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(roadX,z0); ctx.lineTo(roadX,z0+cell.size*scale); ctx.stroke();
    }
  }
  const mapPoint = point => ({
    x: pad + (point.x-minX)*scale,
    y: top + point.z*scale
  });
  if (navigation.waypoint) {
    const p = mapPoint(navigation.waypoint);
    ctx.fillStyle = "#f4d36e"; ctx.beginPath(); ctx.arc(p.x,p.y,7,0,Math.PI*2); ctx.fill();
  }
  const p = mapPoint(position);
  ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(heading);
  ctx.fillStyle = "#6fe3a5"; ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(7,8); ctx.lineTo(0,5); ctx.lineTo(-7,8); ctx.closePath(); ctx.fill();
  ctx.restore();
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
addEventListener("pagehide",() => orientation.stop());
