/**
 * Versioned save-data contract. Storage adapter is injected; no browser
 * storage is accessed until the application explicitly supplies an adapter.
 */
export class SaveSystem {
  constructor(adapter, slot = "valley-city-save") {
    this.adapter = adapter;
    this.slot = slot;
    this.version = 1;
  }

  createSnapshot(state) {
    return {
      version: this.version,
      savedAt: new Date().toISOString(),
      player: state.player ?? null,
      world: state.world ?? null,
      vehicles: state.vehicles ?? [],
      progress: state.progress ?? {}
    };
  }

  async save(state) {
    if (!this.adapter?.write) throw new Error("Save adapter is not configured");
    await this.adapter.write(this.slot, this.createSnapshot(state));
  }

  async load() {
    if (!this.adapter?.read) return null;
    const data = await this.adapter.read(this.slot);
    if (!data || data.version !== this.version) return null;
    return data;
  }
}
