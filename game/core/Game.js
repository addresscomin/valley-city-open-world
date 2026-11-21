/**
 * Game lifecycle coordinator.
 * Systems are injected so each subsystem can be tested independently.
 */
export class Game {
  constructor({ sceneManager, inputManager, worldManager, uiManager, saveSystem }) {
    this.sceneManager = sceneManager;
    this.inputManager = inputManager;
    this.worldManager = worldManager;
    this.uiManager = uiManager;
    this.saveSystem = saveSystem;
    this.state = "boot";
    this.running = false;
    this.frameId = null;
    this.lastTime = 0;
  }

  async start() {
    if (this.running) return;
    this.state = "loading";
    await this.sceneManager.initialize();
    await this.worldManager.initialize();
    await this.uiManager.showMainMenu();
    this.running = true;
    this.state = "menu";
  }

  enterWorld() {
    if (!this.running) throw new Error("Game has not started");
    this.state = "playing";
    this.lastTime = performance.now();
  }

  pause() {
    if (this.state !== "playing") return;
    this.state = "paused";
    this.uiManager.showPauseMenu();
  }

  resume() {
    if (this.state !== "paused") return;
    this.state = "playing";
    this.lastTime = performance.now();
  }

  stop() {
    this.running = false;
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.state = "stopped";
  }
}
