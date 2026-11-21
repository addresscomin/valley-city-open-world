/**
 * Owns the Three.js scene, camera and renderer lifecycle.
 * The renderer adapter is injected so the game can be tested without WebGL.
 */
export class SceneManager {
  constructor({ scene, camera, renderer, mount }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mount = mount;
    this.initialized = false;
  }

  async initialize() {
    if (!this.scene || !this.camera || !this.renderer || !this.mount) {
      throw new Error("SceneManager requires scene, camera, renderer and mount");
    }
    this.renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    this.mount.appendChild(this.renderer.domElement);
    this.initialized = true;
  }

  render() {
    if (this.initialized) this.renderer.render(this.scene, this.camera);
  }

  resize(width, height) {
    if (!this.initialized || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    if (this.renderer?.domElement?.parentNode === this.mount) {
      this.mount.removeChild(this.renderer.domElement);
    }
    this.renderer?.dispose?.();
    this.initialized = false;
  }
}
