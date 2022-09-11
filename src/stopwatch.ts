export type StopwatchTimingType = 'date' | 'performance';

/** The options for a {@link Stopwatch}. */
export interface StopwatchOptions {
  type?: StopwatchTimingType;
  startNow?: boolean;
}

export interface StopwatchLap {
  readonly elapsed: number;
  readonly timestamp: number;
}

/** A stopwatch, with time recorded in milliseconds. */
export class Stopwatch {
  type: StopwatchTimingType;

  startTime = -1;
  stopTime = -1;
  stopped = true;

  #continueTime = 0;
  #timeOffset = 0;

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
    if (this.startTime === -1) this.startTime = now;
    this.#continueTime = now;
    this.stopTime = -1;
  }

  lap() {
    const [elapsed, now] = this.#elapsedWithNow();
    const lap: StopwatchLap = { elapsed, timestamp: now };
    this.laps.push(lap);
    return lap;
  }

  stop(recordLap = false) {
    const [elapsed, now] = this.#elapsedWithNow();
    this.#timeOffset = elapsed;
    this.stopped = true;
    this.stopTime = now;

    const lap: StopwatchLap = { elapsed, timestamp: now };
    if (recordLap) this.laps.push(lap);
    return lap;
  }

  reset() {
    this.startTime = -1;
    this.stopTime = -1;
    this.stopped = true;
    this.#continueTime = 0;
    this.#timeOffset = 0;
    this.laps.splice(0, this.laps.length);
  }
}
