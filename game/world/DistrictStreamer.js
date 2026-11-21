/**
 * Maintains a small active cell window around the player.
 * Cell activation delegates to WorldManager, which owns resource lifetime.
 */
export class DistrictStreamer {
  constructor(worldManager, { loadRadius = 1, unloadRadius = 2 } = {}) {
    this.worldManager = worldManager;
    this.loadRadius = loadRadius;
    this.unloadRadius = Math.max(loadRadius, unloadRadius);
    this.activeIds = new Set();
  }

  async update(playerPosition) {
    const cells = this.worldManager.cells;
    const nearest = cells
      .map((cell) => {
        const cx = cell.origin[0] + cell.size / 2;
        const cz = cell.origin[1] + cell.size / 2;
        return { id: cell.id, distance: Math.hypot(cx - playerPosition.x, cz - playerPosition.z) };
      })
      .sort((a, b) => a.distance - b.distance);

    const cellSize = cells[0]?.size ?? 250;
    const loadDistance = cellSize * this.loadRadius;
    const unloadDistance = cellSize * this.unloadRadius;
    const wanted = new Set(nearest.filter((item) => item.distance <= loadDistance).map((item) => item.id));

    for (const id of wanted) {
      if (!this.activeIds.has(id)) {
        await this.worldManager.activateCell(id);
        this.activeIds.add(id);
      }
    }

    for (const id of [...this.activeIds]) {
      const item = nearest.find((entry) => entry.id === id);
      if (!item || item.distance > unloadDistance) {
        await this.worldManager.releaseCell(id);
        this.activeIds.delete(id);
      }
    }
    return [...this.activeIds];
  }

  async clear() {
    for (const id of [...this.activeIds]) await this.worldManager.releaseCell(id);
    this.activeIds.clear();
  }
}
