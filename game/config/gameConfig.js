export const GAME_CONFIG = Object.freeze({
  title: "VALLEY CITY",
  setting: "Dubai-inspired original city",
  firstPlatform: "android",
  orientation: "landscape",
  targetMemoryGB: 4,
  render: {
    antialias: false,
    maxPixelRatio: 1.5,
    shadowQuality: "low",
    defaultQuality: "low"
  },
  world: {
    activeDistrictRadius: 1,
    cellSizeMeters: 250,
    highDetailRadius: 1,
    mediumDetailRadius: 2
  },
  controls: {
    touch: true,
    keyboard: true,
    gamepadReady: true
  }
});
