/**
 * Mission progression for safe city activities and exploration.
 * Each objective may define a world-space waypoint.
 */
export class MissionManager {
  constructor() {
    this.definitions = new Map();
    this.activeMissionId = null;
    this.progress = {};
  }

  register(mission) {
    if (!mission?.id || !mission?.type || !Array.isArray(mission.objectives) || mission.objectives.length === 0) {
      throw new Error("Mission needs id, type and at least one objective");
    }
    if (this.definitions.has(mission.id)) throw new Error(`Duplicate mission: ${mission.id}`);
    const objectives = mission.objectives.map((objective, index) => {
      if (!objective?.id || !objective?.label) throw new Error(`Mission objective ${index} needs id and label`);
      return Object.freeze({ ...objective });
    });
    this.definitions.set(mission.id, Object.freeze({ ...mission, objectives: Object.freeze(objectives) }));
    return this.definitions.get(mission.id);
  }

  start(id) {
    const mission = this.definitions.get(id);
    if (!mission) throw new Error(`Unknown mission: ${id}`);
    this.activeMissionId = id;
    this.progress[id] = { objectiveIndex: 0, status: "active" };
    return mission;
  }

  completeObjective() {
    const mission = this.getActiveMission();
    const state = this.progress[this.activeMissionId];
    if (!mission || !state || state.status !== "active") return null;
    state.objectiveIndex = Math.min(state.objectiveIndex + 1, mission.objectives.length);
    if (state.objectiveIndex >= mission.objectives.length) state.status = "complete";
    return { ...state };
  }

  getActiveMission() {
    return this.definitions.get(this.activeMissionId) ?? null;
  }

  getCurrentObjective() {
    const mission = this.getActiveMission();
    const state = this.progress[this.activeMissionId];
    if (!mission || !state || state.status !== "active") return null;
    return mission.objectives[state.objectiveIndex] ?? null;
  }

  getProgress() {
    const mission = this.getActiveMission();
    const state = this.progress[this.activeMissionId];
    if (!mission || !state) return null;
    return { ...state, totalObjectives: mission.objectives.length, title: mission.title };
  }
}
