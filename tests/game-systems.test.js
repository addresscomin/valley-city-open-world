import test from "node:test";
import assert from "node:assert/strict";
import { PlayerController } from "../game/player/PlayerController.js";
import { WorldCollision } from "../game/world/WorldCollision.js";
import { MissionManager } from "../game/systems/MissionManager.js";

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
