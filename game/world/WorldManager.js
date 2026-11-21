import { DISTRICTS, WORLD_CELLS } from "./districts.js";

/**
 * Owns district metadata and the active streaming window.
 * Actual 3D asset loading is added after the greybox cell format is tested.
 */
export class WorldManager {
  constructor({ cellLoader, cellDisposer, activeRadius = 1 } = {}) {
    this.cellLoader = cellLoader;
    this.cellDisposer = cellDisposer;
    this.activeRadius = activeRadius;
    this.districts = DISTRICTS;
    this.cells = WORLD_CELLS;
    this.loaded = new Map();
  }

  async initialize() {
    return this.districts;
  }

  getDistrict(id) {
    return this.districts.find((district) => district.id === id) ?? null;
  }

  async activateCell(cellId) {
    if (this.loaded.has(cellId)) return this.loaded.get(cellId);
    const cell = this.cells.find((item) => item.id === cellId);
    if (!cell) throw new Error(`Unknown world cell: ${cellId}`);
    const resource = this.cellLoader ? await this.cellLoader(cell) : { metadata: cell };
    this.loaded.set(cellId, resource);
    return resource;
  }

  async releaseCell(cellId) {
    if (!this.loaded.has(cellId)) return;
    const resource = this.loaded.get(cellId);
    if (this.cellDisposer) await this.cellDisposer(resource);
    this.loaded.delete(cellId);
  }
}
