export type PreciseStopwatchTimingType = 'hrtime' | 'performance';
export interface PreciseStopwatchOptions {
  type?: PreciseStopwatchTimingType;
  startNow?: boolean;
}

export interface PreciseStopwatchLap {
  readonly elapsed: bigint;
  readonly timestamp: bigint;
}

export class PreciseStopwatch {
  type: PreciseStopwatchTimingType;

  startTime = -1n;
  stopTime = -1n;
  stopped = true;

  #continueTime = 0n;
  #timeOffset = 0n;

  readonly laps: PreciseStopwatchLap[] = [];

  constructor(options?: PreciseStopwatchOptions) {
    this.type = options?.type ?? (typeof process === 'undefined' ? 'performance' : 'hrtime');

    if (options?.startNow) this.start();
  }

  #perfToBigInt(time: number) {
    const ms = Math.floor(time);
    const ns = BigInt(Math.floor((time - ms) * 1e6));
    return BigInt(ms) * 1_000_000n + ns;
  }

  #now() {
    switch (this.type) {
      case 'hrtime': {
        return process.hrtime.bigint();
      }
      case 'performance': {
        return this.#perfToBigInt(performance.timeOrigin) + this.#perfToBigInt(performance.now());
      }
    }
  }

  get elapsed() {
    return this.#elapsedWithNow()[0];
  }

  #elapsedWithNow() {
    const now = this.#now();
    return [this.stopped ? this.#timeOffset : this.#timeOffset + (now - this.#continueTime), now];
  }

  start() {
    const now = this.#now();
    this.stopped = false;
    if (this.startTime === -1n) this.startTime = now;
    this.#continueTime = now;
    this.stopTime = -1n;
  }

  lap() {
    const [elapsed, now] = this.#elapsedWithNow();
    const lap: PreciseStopwatchLap = { elapsed, timestamp: now };
    this.laps.push(lap);
    return lap;
  }

  stop(recordLap = false) {
    const [elapsed, now] = this.#elapsedWithNow();
    this.#timeOffset = elapsed;
    this.stopped = true;
    this.stopTime = now;

    const lap: PreciseStopwatchLap = { elapsed, timestamp: now };
    if (recordLap) this.laps.push(lap);
    return lap;
  }

  reset() {
    this.startTime = -1n;
    this.stopTime = -1n;
    this.stopped = true;
    this.#continueTime = 0n;
    this.#timeOffset = 0n;
    this.laps.splice(0, this.laps.length);
  }
}
