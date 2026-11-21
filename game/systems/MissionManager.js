/**
 * Safe activity framework: delivery routes, sightseeing, time trials,
 * driving lessons and exploration discoveries.
 */
export class MissionManager {
  constructor() {
    this.definitions = new Map();
    this.activeMissionId = null;
    this.progress = {};
  }

  register(mission) {
    if (!mission?.id || !mission?.type || !Array.isArray(mission.objectives)) {
      throw new Error("Mission needs id, type and objectives");
    }
    this.definitions.set(mission.id, Object.freeze({ ...mission }));
  }

  start(id) {
    const mission = this.definitions.get(id);
    if (!mission) throw new Error(`Unknown mission: ${id}`);
    this.activeMissionId = id;
    this.progress[id] = { objectiveIndex: 0, status: "active" };
    return mission;
  }

  completeObjective() {
    const mission = this.definitions.get(this.activeMissionId);
    const state = this.progress[this.activeMissionId];
    if (!mission || !state || state.status !== "active") return null;
    state.objectiveIndex += 1;
    if (state.objectiveIndex >= mission.objectives.length) state.status = "complete";
    return { ...state };
  }

  getActiveMission() {
    return this.definitions.get(this.activeMissionId) ?? null;
  }
}
