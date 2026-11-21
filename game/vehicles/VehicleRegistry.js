/** Stores original in-game vehicle definitions by stable ID. */
export class VehicleRegistry {
  constructor() {
    this.vehicles = new Map();
  }

  register(definition) {
    if (!definition?.id) throw new Error("Vehicle definition needs an id");
    if (this.vehicles.has(definition.id)) throw new Error(`Duplicate vehicle: ${definition.id}`);
    this.vehicles.set(definition.id, Object.freeze({ ...definition }));
  }

  get(id) {
    return this.vehicles.get(id) ?? null;
  }

  list() {
    return [...this.vehicles.values()];
  }
}
