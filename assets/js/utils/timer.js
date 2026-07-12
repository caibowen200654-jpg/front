/* ============================================
   计时器工具
   ============================================ */

class Timer {
  constructor(options = {}) {
    this.duration = options.duration || 0; // 总时长（秒），0表示正计时
    this.onTick = options.onTick || (() => {});
    this.onEnd = options.onEnd || (() => {});
    this.interval = null;
    this.elapsed = 0;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.interval = setInterval(() => {
      this.elapsed++;
      this.onTick(this.getRemaining(), this.elapsed);
      if (this.duration > 0 && this.elapsed >= this.duration) {
        this.stop();
        this.onEnd();
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.running = false;
  }

  reset() {
    this.stop();
    this.elapsed = 0;
  }

  getRemaining() {
    if (this.duration === 0) return -1; // 正计时模式
    return Math.max(0, this.duration - this.elapsed);
  }

  getElapsed() {
    return this.elapsed;
  }

  isRunning() {
    return this.running;
  }

  isLow(treshold = 300) {
    const remaining = this.getRemaining();
    return remaining > 0 && remaining <= treshold;
  }
}
