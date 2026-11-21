/**
 * Four adjacent, fictionalized districts in game-world meters.
 * Coordinates are original gameplay coordinates, not surveyed real locations.
 */
export const DISTRICTS = Object.freeze([
  { id: "downtown", name: "Downtown", center: [125, 125], cellIds: ["downtown-00"], status: "greybox" },
  { id: "marina", name: "Marina", center: [375, 125], cellIds: ["marina-00"], status: "greybox" },
  { id: "highway", name: "Sheikh Zayed Corridor", center: [125, 375], cellIds: ["highway-00"], status: "greybox" },
  { id: "desert", name: "Desert Outskirts", center: [-125, 125], cellIds: ["desert-00"], status: "greybox" }
]);

export const WORLD_CELLS = Object.freeze([
  { id: "downtown-00", districtId: "downtown", origin: [0, 0], size: 250, lod: ["high", "medium", "far"] },
  { id: "marina-00", districtId: "marina", origin: [250, 0], size: 250, lod: ["high", "medium", "far"] },
  { id: "highway-00", districtId: "highway", origin: [0, 250], size: 250, lod: ["high", "medium", "far"] },
  { id: "desert-00", districtId: "desert", origin: [-250, 0], size: 250, lod: ["high", "medium", "far"] }
]);
