import test from "node:test";
import assert from "node:assert/strict";
import { PlayerController } from "../game/player/PlayerController.js";
import { WorldCollision } from "../game/world/WorldCollision.js";
import { MissionManager } from "../game/systems/MissionManager.js";
import { VehicleController } from "../game/vehicles/VehicleController.js";

test("on-foot diagonal movement is normalized", () => {
  const player = new PlayerController({ moveSpeed: 8 });
  player.update({ moveX: 1, moveY: 1 }, 1);
  assert.ok(Math.abs(Math.hypot(player.position.x, player.position.z) - 8) < 1e-9);
});

test("player remains still when there is no movement input", () => {
  const player = new PlayerController();
  player.position = { x: 12, y: 0, z: -4 };
  player.update({ moveX: 0, moveY: 0 }, 1);
  assert.deepEqual(player.position, { x: 12, y: 0, z: -4 });
  assert.equal(player.state, "idle");
});

test("collision resolution slides along a wall when one axis is clear", () => {
  const world = {
    loaded: new Map([["test-cell", {
      colliders: [{ minX: 5, maxX: 6, minZ: 5, maxZ: 6 }]
    }]])
  };
  const collision = new WorldCollision(world);
  const position = { x: 5.5, z: 5.5 };
  const collided = collision.resolve(position, { x: 4, z: 4 }, 1);
  assert.equal(collided, true);
  assert.deepEqual(position, { x: 5.5, z: 4 });
  assert.equal(collision.collides(position.x, position.z, 1), false);
});

test("mission completes after its final objective and cannot advance again", () => {
  const missions = new MissionManager();
  missions.register({
    id: "plaza-discovery",
    type: "sightseeing",
    objectives: [{ id: "reach-plaza", label: "Reach the plaza" }]
  });
  missions.start("plaza-discovery");
  assert.deepEqual(missions.completeObjective(), { objectiveIndex: 1, status: "complete" });
  assert.equal(missions.completeObjective(), null);
});

test("vehicle enter and exit enforce occupancy state", () => {
  const car = new VehicleController();
  assert.equal(car.enter("city-runner"), true);
  assert.equal(car.enter("second-car"), false);
  assert.equal(car.exit(), true);
  assert.equal(car.exit(), false);
  assert.equal(car.state, "unoccupied");
});

test("vehicle acceleration is capped and speed is expressed in km/h", () => {
  const car = new VehicleController({ maxSpeed: 100, acceleration: 50 });
  car.enter("city-runner");
  for (let i = 0; i < 100; i++) car.update({ throttle: true }, 0.05);
  assert.equal(car.speed, 100);
});

test("vehicle brake slows forward motion before engaging reverse", () => {
  const car = new VehicleController({ acceleration: 50, braking: 100, reverseSpeed: 20 });
  car.enter("city-runner");
  for (let i = 0; i < 4; i++) car.update({ throttle: true }, 0.05);
  assert.equal(car.speed, 10);
  car.update({ brake: true }, 0.05);
  assert.equal(car.speed, 5);
  car.update({ brake: true }, 0.05);
  assert.equal(car.speed, 0);
  car.update({ brake: true }, 0.05);
  assert.ok(car.speed < 0);
  assert.ok(car.speed >= -20);
});

test("vehicle steering is speed-dependent and does not rotate while stopped", () => {
  const car = new VehicleController();
  car.enter("city-runner");
  car.update({ steer: 1 }, 0.05);
  assert.equal(car.heading, 0);
  car.update({ throttle: true, steer: 1 }, 0.05);
  assert.ok(car.heading > 0);
});

test("mission exposes sequential objectives and completes only at the end", () => {
  const missions = new MissionManager();
  missions.register({ id:"tour", type:"exploration", title:"City Tour", objectives:[
    { id:"a", label:"First stop", x:1, z:2 },
    { id:"b", label:"Second stop", x:3, z:4 }
  ]});
  missions.start("tour");
  assert.equal(missions.getCurrentObjective().id, "a");
  assert.equal(missions.completeObjective().status, "active");
  assert.equal(missions.getCurrentObjective().id, "b");
  assert.equal(missions.completeObjective().status, "complete");
  assert.equal(missions.getCurrentObjective(), null);
  assert.equal(missions.completeObjective(), null);
});
