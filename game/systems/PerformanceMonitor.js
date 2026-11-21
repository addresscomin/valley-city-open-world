/** Basic frame-time sampler for device profiling during development. */
export class PerformanceMonitor {
  constructor(sampleSize = 60) {
    this.sampleSize = sampleSize;
    this.frameTimes = [];
  }

  record(deltaSeconds) {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;
    this.frameTimes.push(deltaSeconds);
    if (this.frameTimes.length > this.sampleSize) this.frameTimes.shift();
  }

  getSnapshot() {
    if (!this.frameTimes.length) return { fps: 0, averageFrameMs: 0 };
    const average = this.frameTimes.reduce((sum, value) => sum + value, 0) / this.frameTimes.length;
    return { fps: 1 / average, averageFrameMs: average * 1000 };
  }
}
