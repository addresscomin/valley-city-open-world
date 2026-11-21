/**
 * Normalizes touch and keyboard input into one gameplay contract.
 * UI buttons can call setAction(action, pressed); keyboard bindings are optional.
 */
export class InputManager {
  constructor() {
    this.actions = new Map();
    this.enabled = true;
  }

  setAction(action, pressed) {
    if (!this.enabled) return;
    this.actions.set(action, Boolean(pressed));
  }

  isPressed(action) {
    return Boolean(this.actions.get(action));
  }

  getPlayerInput() {
    return {
      moveX: Number(this.isPressed("right")) - Number(this.isPressed("left")),
      moveY: Number(this.isPressed("back")) - Number(this.isPressed("forward")),
      sprint: this.isPressed("sprint")
    };
  }

  getVehicleInput() {
    return {
      throttle: this.isPressed("throttle"),
      brake: this.isPressed("brake"),
      steer: Number(this.isPressed("steerRight")) - Number(this.isPressed("steerLeft"))
    };
  }

  clear() {
    this.actions.clear();
  }
}
