/**
 * Lightweight road graph for route planning and district navigation.
 * Nodes and edges use game-world coordinates in meters.
 */
export class RoadGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode(id, position, metadata = {}) {
    this.nodes.set(id, { id, position, metadata });
    if (!this.edges.has(id)) this.edges.set(id, []);
  }

  connect(a, b, distance = null) {
    if (!this.nodes.has(a) || !this.nodes.has(b)) {
      throw new Error("Both road nodes must exist before connecting them");
    }
    const pa = this.nodes.get(a).position;
    const pb = this.nodes.get(b).position;
    const cost = distance ?? Math.hypot(pb.x - pa.x, pb.z - pa.z);
    this.edges.get(a).push({ to: b, cost });
    this.edges.get(b).push({ to: a, cost });
  }

  getNeighbors(id) {
    return this.edges.get(id) ?? [];
  }
}
