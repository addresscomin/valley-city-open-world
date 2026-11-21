/**
 * UI screen state coordinator. DOM components are attached by the browser UI.
 */
export class UIManager {
  constructor({ onScreenChange = () => {} } = {}) {
    this.currentScreen = "loading";
    this.onScreenChange = onScreenChange;
  }

  show(screen) {
    this.currentScreen = screen;
    this.onScreenChange(screen);
  }

  showMainMenu() { this.show("main-menu"); }
  showHUD() { this.show("hud"); }
  showPauseMenu() { this.show("pause"); }
  showMap() { this.show("world-map"); }
  showGarage() { this.show("garage"); }
  showSettings() { this.show("settings"); }
  showMissionBriefing() { this.show("mission-briefing"); }
  showMissionResults() { this.show("mission-results"); }
}
