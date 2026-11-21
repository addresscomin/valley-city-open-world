/**
 * Arcade city-driving model. Speed is stored in km/h; world movement converts
 * it to m/s. Reverse engages only after braking through a complete stop.
 */
export class VehicleController {
  constructor({ maxSpeed = 120, reverseSpeed = 18, acceleration = 42, braking = 90, steeringRate = 1.8 } = {}) {
    this.maxSpeed = maxSpeed;
    this.reverseSpeed = reverseSpeed;
    this.acceleration = acceleration;
    this.braking = braking;
    this.steeringRate = steeringRate;
    this.speed = 0;
    this.heading = 0;
    this.activeVehicleId = null;
    this.state = "unoccupied";
  }

  enter(vehicleId) {
    if (this.state === "occupied" || !vehicleId) return false;
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

  update(input = {}, deltaSeconds = 0) {
    if (this.state !== "occupied") return this.speed;
    const dt = Math.max(0, Math.min(Number(deltaSeconds) || 0, 0.05));
    const throttle = Boolean(input.throttle);
    const brake = Boolean(input.brake);
    if (throttle && !brake) {
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration * dt);
    } else if (brake) {
      if (this.speed > 0.5) this.speed = Math.max(0, this.speed - this.braking * dt);
      else if (this.speed < -0.5) this.speed = Math.min(0, this.speed + this.braking * dt);
      else this.speed = Math.max(-this.reverseSpeed, this.speed - this.acceleration * 0.55 * dt);
    } else {
      const drag = 7.5 * dt;
      this.speed = Math.abs(this.speed) <= drag ? 0 : this.speed - Math.sign(this.speed) * drag;
    }
    const steer = Math.max(-1, Math.min(1, Number(input.steer) || 0));
    if (Math.abs(this.speed) > 0.2) {
      const speedFactor = 0.25 + Math.min(Math.abs(this.speed) / this.maxSpeed, 1) * 0.75;
      this.heading += steer * this.steeringRate * speedFactor * dt * Math.sign(this.speed);
    }
    return this.speed;
  }
}
