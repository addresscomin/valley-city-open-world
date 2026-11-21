/**
 * Vehicle state and input contract. Physics integration is deliberately
 * isolated behind this controller so the physics backend can change later.
 */
export class VehicleController {
  constructor({ maxSpeed = 32, acceleration = 12, braking = 22 } = {}) {
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.braking = braking;
    this.speed = 0;
    this.heading = 0;
    this.activeVehicleId = null;
    this.state = "unoccupied";
  }

  enter(vehicleId) {
    if (this.state === "occupied") return false;
    this.activeVehicleId = vehicleId;
    this.state = "occupied";
    return true;
  }

  exit() {
    if (this.state !== "occupied") return false;
    this.activeVehicleId = null;
    this.speed = 0;
    this.state = "unoccupied";
    return true;
  }

  update(input, deltaSeconds) {
    if (this.state !== "occupied") return this.speed;
    if (input.throttle) this.speed += this.acceleration * deltaSeconds;
    else this.speed *= Math.max(0, 1 - 1.4 * deltaSeconds);
    if (input.brake) this.speed -= this.braking * deltaSeconds;
    this.speed = Math.max(-8, Math.min(this.maxSpeed, this.speed));
    this.heading += Number(input.steer || 0) * deltaSeconds * (0.6 + Math.abs(this.speed) * 0.035);
    return this.speed;
  }
}
