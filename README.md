<div align="center">

<h1>✨⏱️<br />magic-stopwatch</h1>

[![NPM version](https://img.shields.io/npm/v/magic-stopwatch?maxAge=3600?&color=3498db)](https://www.npmjs.com/package/magic-stopwatch) [![NPM downloads](https://img.shields.io/npm/dt/magic-stopwatch?maxAge=3600&color=3498db)](https://www.npmjs.com/package/magic-stopwatch) [![ESLint status](https://github.com/Snazzah/magic-stopwatch/workflows/ESLint/badge.svg)](https://github.com/Snazzah/magic-stopwatch/actions?query=workflow%3A%22ESLint%22)

`npm install magic-stopwatch` - `yarn add magic-stopwatch`


A light and pause-able stopwatch.

</div>

### Quickstart

```js
import { Stopwatch } from 'magic-stopwatch';

// By default, the stopwatch uses the 'performance' type if available
// - 'performance' type uses Performance Hooks: https://nodejs.org/api/perf_hooks.html#performancenow
// - 'date' type to use Date.now()
const stopwatch = new Stopwatch({ type: 'performance' });

stopwatch.start();

// do something for 5 seconds...

const middleLap = stopwatch.lap();
// { elapsed: 5000, timestamp: 1662925989428 }

// do something for 5 more seconds...

const stopLap = stopwatch.stop();
// { elapsed: 10000, timestamp: 1662925989428 }
```

You can also use this within modern browsers:
```html
<script src="https://unpkg.com/magic-stopwatch@1.0.1/webpack/magic-stopwatch.min.js"></script>
```

And can be accessed with the `magicStopwatch` global.
```js
const stopwatch = new magicStopwatch.Stopwatch();
```

### API
- `Stopwatch` - A stopwatch that records in milliseconds.
  - `new Stopwatch({ type, startNow })`
    - `type` - The type of timing the stopwatch will use, defaults to [`performance`](https://nodejs.org/api/perf_hooks.html#performancenow) if available, else it will use `date`. (`Date.now()`)
    - `startNow` - Whether or not to immediately start the stopwatch.

  - `laps: StopwatchLap[]` - The laps the stopwatch has, recorded with `.lap()`.
  - `elapsed: number` - A getter that returns the amount of time elapsed on the stopwatch.
  - `stopped: boolean` - Whether or not the stopwatch has stopped.
  - `startTime: number` - The time the stopwatch started at. Will be `-1` if not started.
  - `stopTime: number` - The time the stopwatch stopped at. Will be `-1` if not stopped.

  - `start()` - Starts the stopwatch.
  - `lap() -> StopwatchLap` - Creates a lap and stores it in `laps`.
  - `stop(recordLap) -> StopwatchLap` - Stops the stopwatch.
    - `recordLap = false` - Whether or not to record the lap in `laps`.
  - `reset()` - Resets the stopwatch.
- `PreciseStopwatch` - A stopwatch that records in nanoseconds.
  - `new PreciseStopwatch({ type, startNow })`
    - `type` - The type of timing the stopwatch will use, defaults to [`hrtime`](https://nodejs.org/api/process.html#processhrtimebigint) if available, else it will use [`performance`](https://nodejs.org/api/perf_hooks.html#performancenow).
    - `startNow` - Whether or not to immediately start the stopwatch.

  - `laps: PreciseStopwatchLap[]` - The laps the stopwatch has, recorded with `.lap()`.
  - `elapsed: number` - A getter that returns the amount of time elapsed on the stopwatch.
  - `stopped: boolean` - Whether or not the stopwatch has stopped.
  - `startTime: bigint` - The time the stopwatch started at. Will be `-1n` if not started.
  - `stopTime: bigint` - The time the stopwatch stopped at. Will be `-1n` if not stopped.

  - `start()` - Starts the stopwatch.
  - `lap() -> PreciseStopwatchLap` - Creates a lap and stores it in `laps`.
  - `stop(recordLap) -> PreciseStopwatchLap` - Stops the stopwatch.
    - `recordLap = false` - Whether or not to record the lap in `laps`.
  - `reset()` - Resets the stopwatch.

