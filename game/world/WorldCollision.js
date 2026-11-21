/**
 * Lightweight AABB collision for low-poly district blocks.
 * Kept separate from rendering so a future physics backend can replace it.
 */
export class WorldCollision {
  constructor(worldManager) {
    this.worldManager = worldManager;
  }

  collides(x, z, radius = 0.5) {
    for (const resource of this.worldManager.loaded.values()) {
      for (const box of resource.colliders || []) {
        const closestX = Math.max(box.minX, Math.min(x, box.maxX));
        const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
        const dx = x - closestX;
        const dz = z - closestZ;
        if (dx*dx + dz*dz < radius*radius) return true;
      }
    }
    return false;
  }

  resolve(position, previous, radius = 0.5) {
    if (!this.collides(position.x, position.z, radius)) return false;
    // Slide along a wall when one axis remains clear.
    if (!this.collides(position.x, previous.z, radius)) {
      position.z = previous.z;
    } else if (!this.collides(previous.x, position.z, radius)) {
      position.x = previous.x;
    } else {
      position.x = previous.x;
      position.z = previous.z;
    }
    return true;
  }
}
