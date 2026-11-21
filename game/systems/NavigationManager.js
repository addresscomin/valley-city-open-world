/** Waypoints and map-marker state shared by HUD and world navigation. */
export class NavigationManager {
  constructor() {
    this.waypoint = null;
    this.discovered = new Set();
  }

  setWaypoint(point) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.z)) {
      throw new Error("Waypoint requires finite x and z coordinates");
    }
    this.waypoint = { x: point.x, z: point.z, label: point.label ?? "Waypoint" };
  }

  clearWaypoint() {
    this.waypoint = null;
  }

  discover(locationId) {
    this.discovered.add(locationId);
  }

  distanceFrom(position) {
    if (!this.waypoint) return null;
    return Math.hypot(this.waypoint.x - position.x, this.waypoint.z - position.z);
  }
}
