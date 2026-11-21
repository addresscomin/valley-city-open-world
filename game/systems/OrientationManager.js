/** Landscape-first orientation helper for mobile browser and native wrappers. */
export class OrientationManager {
  constructor(onChange = () => {}) {
    this.onChange = onChange;
    this.media = null;
    this.handleChange = () => this.onChange(this.isLandscape());
  }

  isLandscape() {
    if (typeof globalThis.matchMedia === "function") {
      return globalThis.matchMedia("(orientation: landscape)").matches;
    }
    return globalThis.innerWidth >= globalThis.innerHeight;
  }

  async requestLandscape() {
    try {
      await globalThis.screen?.orientation?.lock?.("landscape");
    } catch {
      // Browsers may require fullscreen or a native wrapper; show rotate guidance instead.
    }
    this.onChange(this.isLandscape());
    return this.isLandscape();
  }

  start() {
    if (typeof globalThis.matchMedia !== "function") return;
    this.media = globalThis.matchMedia("(orientation: landscape)");
    this.media.addEventListener?.("change", this.handleChange);
    this.handleChange();
  }

  stop() {
    this.media?.removeEventListener?.("change", this.handleChange);
    this.media = null;
  }
}
