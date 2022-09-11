export type PreciseStopwatchTimingType = 'hrtime' | 'performance';

/** The options for a {@link PreciseStopwatch}. */
export interface PreciseStopwatchOptions {
  /**
   * The type of timing to use in the stopwatch.
   * - `'hrtime'` - Uses [`process.hrtime.bigint()`](https://nodejs.org/api/process.html#processhrtimebigint) for timing, used by default if available.
   * - `'performance'` - Uses [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) for timing. [May be rounded](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#reduced_time_precision) for some browsers.
   */
  type?: PreciseStopwatchTimingType;
  /**
   * Whether or not to start after initialization.
   * @default false
   */
  startNow?: boolean;
}

export interface PreciseStopwatchLap {
  /** The amount of time elapsed from the stopwatch. */
  readonly elapsed: bigint;
  /** The timestamp when this lap was recorded. */
  readonly timestamp: bigint;
}

/** A stopwatch that records in nanoseconds. */
export class PreciseStopwatch {
  type: PreciseStopwatchTimingType;

  /** The time the stopwatch started at. Will be `-1n` if not started. */
  startTime = -1n;
  /** The time the stopwatch stopped at. Will be `-1n` if not stopped. */
  stopTime = -1n;
  /** Whether or not the timestamp has stopped. */
  stopped = true;

  #continueTime = 0n;
  #timeOffset = 0n;

  /** The laps that the stopwatch has recorded. */
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

  /** The amount of time that has elapsed on the stopwatch, in nanoseconds. */
  get elapsed() {
    return this.#elapsedWithNow()[0];
  }

  #elapsedWithNow() {
    const now = this.#now();
    return [this.stopped ? this.#timeOffset : this.#timeOffset + (now - this.#continueTime), now];
  }

  /** Starts the stopwatch. */
  start() {
    const now = this.#now();
    this.stopped = false;
    if (this.startTime === -1n) this.startTime = now;
    this.#continueTime = now;
    this.stopTime = -1n;
  }

  /** Creates a lap in the stopwatch. */
  lap() {
    const [elapsed, now] = this.#elapsedWithNow();
    const lap: PreciseStopwatchLap = { elapsed, timestamp: now };
    this.laps.push(lap);
    return lap;
  }

  /**
   * Stops the stopwatch.
   * @param recordLap Whether or not to record this lap in the stopwatch.
   */
  stop(recordLap = false) {
    const [elapsed, now] = this.#elapsedWithNow();
    this.#timeOffset = elapsed;
    this.stopped = true;
    this.stopTime = now;

    const lap: PreciseStopwatchLap = { elapsed, timestamp: now };
    if (recordLap) this.laps.push(lap);
    return lap;
  }

  /** Resets the stopwatch. */
  reset() {
    this.startTime = -1n;
    this.stopTime = -1n;
    this.stopped = true;
    this.#continueTime = 0n;
    this.#timeOffset = 0n;
    this.laps.splice(0, this.laps.length);
  }
}
