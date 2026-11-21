/**
 * Fictionalized district layout. Coordinates are game-world coordinates,
 * not surveyed real-world coordinates.
 */
export const DISTRICTS = Object.freeze([
  { id: "downtown", name: "Downtown", center: [0, 0], cellIds: ["downtown-00"], status: "greybox" },
  { id: "marina", name: "Marina", center: [1200, 0], cellIds: ["marina-00"], status: "planned" },
  { id: "highway", name: "Sheikh Zayed Corridor", center: [0, 1200], cellIds: ["highway-00"], status: "planned" },
  { id: "desert", name: "Desert Outskirts", center: [-1200, 0], cellIds: ["desert-00"], status: "planned" }
]);

export const WORLD_CELLS = Object.freeze([
  { id: "downtown-00", districtId: "downtown", origin: [0, 0], size: 250, lod: ["high", "medium", "far"] },
  { id: "marina-00", districtId: "marina", origin: [1200, 0], size: 250, lod: ["high", "medium", "far"] },
  { id: "highway-00", districtId: "highway", origin: [0, 1200], size: 250, lod: ["high", "medium", "far"] },
  { id: "desert-00", districtId: "desert", origin: [-1200, 0], size: 250, lod: ["high", "medium", "far"] }
]);
