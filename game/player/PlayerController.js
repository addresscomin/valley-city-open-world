/**
 * On-foot movement state and input contract.
 * Rendering/animation adapters will be attached when the character rig is ready.
 */
export class PlayerController {
  constructor({ moveSpeed = 4.5, sprintMultiplier = 1.5 } = {}) {
    this.moveSpeed = moveSpeed;
    this.sprintMultiplier = sprintMultiplier;
    this.state = "idle";
    this.position = { x: 0, y: 0, z: 0 };
    this.heading = 0;
  }

  update(input, deltaSeconds) {
    const x = Number(input.moveX || 0);
    const z = Number(input.moveY || 0);
    const inputLength = Math.hypot(x, z);
    if (!inputLength) {
      this.state = "idle";
      return this.position;
    }

    // Normalize only inputs longer than one unit; preserve analog stick strength.
    const divisor = Math.max(1, inputLength);
    const sprint = input.sprint ? this.sprintMultiplier : 1;
    const step = this.moveSpeed * sprint * deltaSeconds;
    this.position.x += (x / divisor) * step;
    this.position.z += (z / divisor) * step;
    this.heading = Math.atan2(x, z);
    this.state = input.sprint ? "running" : "walking";
    return this.position;
  }
}
