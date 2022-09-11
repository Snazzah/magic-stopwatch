export type StopwatchTimingType = 'date' | 'performance';

/** The options for a {@link Stopwatch}. */
export interface StopwatchOptions {
  /**
   * The type of timing to use in the stopwatch.
   * - `'date'` - Uses [`Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) for timing.
   * - `'performance'` - Uses [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) for timing, used by default if available. [May be rounded](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#reduced_time_precision) for some browsers.
   */
  type?: StopwatchTimingType;
  /**
   * Whether or not to start after initialization.
   * @default false
   */
  startNow?: boolean;
}

export interface StopwatchLap {
  /** The amount of time elapsed from the stopwatch. */
  readonly elapsed: number;
  /** The timestamp when this lap was recorded. */
  readonly timestamp: number;
}

/** A stopwatch that records in milliseconds. */
export class Stopwatch {
  type: StopwatchTimingType;

  /** The time the stopwatch started at. Will be `-1` if not started. */
  startTime = -1;
  /** The time the stopwatch stopped at. Will be `-1` if not stopped. */
  stopTime = -1;
  /** Whether or not the timestamp has stopped. */
  stopped = true;

  #continueTime = 0;
  #timeOffset = 0;

  /** The laps that the stopwatch has recorded. */
  readonly laps: StopwatchLap[] = [];

  constructor(options?: StopwatchOptions) {
    this.type = options?.type ?? (typeof performance === 'undefined' ? 'date' : 'performance');

    if (options?.startNow) this.start();
  }

  #now() {
    switch (this.type) {
      case 'date': {
        return Date.now();
      }
      case 'performance': {
        return Math.floor(performance.timeOrigin) + Math.floor(performance.now());
      }
    }
  }

  /** The amount of time that has elapsed on the stopwatch, in milliseconds. */
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
    if (this.startTime === -1) this.startTime = now;
    this.#continueTime = now;
    this.stopTime = -1;
  }

  /** Creates a lap in the stopwatch. */
  lap() {
    const [elapsed, now] = this.#elapsedWithNow();
    const lap: StopwatchLap = { elapsed, timestamp: now };
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

    const lap: StopwatchLap = { elapsed, timestamp: now };
    if (recordLap) this.laps.push(lap);
    return lap;
  }

  /** Resets the stopwatch. */
  reset() {
    this.startTime = -1;
    this.stopTime = -1;
    this.stopped = true;
    this.#continueTime = 0;
    this.#timeOffset = 0;
    this.laps.splice(0, this.laps.length);
  }
}
