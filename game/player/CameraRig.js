/**
 * Third-person follow-camera target contract.
 * Collision avoidance and smoothing adapters are added with the character rig.
 */
export class CameraRig {
  constructor({ distance = 6.5, height = 3.2, lookHeight = 1.4 } = {}) {
    this.distance = distance;
    this.height = height;
    this.lookHeight = lookHeight;
    this.mode = "third-person";
  }

  getTarget(position, heading) {
    return {
      x: position.x - Math.sin(heading) * this.distance,
      y: position.y + this.height,
      z: position.z - Math.cos(heading) * this.distance,
      lookAt: {
        x: position.x,
        y: position.y + this.lookHeight,
        z: position.z
      }
    };
  }
}
