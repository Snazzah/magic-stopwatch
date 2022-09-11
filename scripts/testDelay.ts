import { PreciseStopwatch, PreciseStopwatchLap, Stopwatch } from '../src';
import parser from 'yargs-parser';

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const args = parser(process.argv.slice(2))

const waitFor = args.w ?? 100;
const times = args.a ?? 100;

async function main() {
  const delayTimes: number[] = [];

  console.log(`ETA: ${(waitFor * times) / 1000} seconds`)

  for (let i = 0; i < times; i++) {
    const sw = args.p ? new PreciseStopwatch({ type: args.t ?? 'performance', startNow: true }) : new Stopwatch({ type: args.t ?? 'date', startNow: true });
    await wait(waitFor);
    const lap = sw.stop();
    if (typeof lap.elapsed === 'bigint') delayTimes.push(Number((lap as PreciseStopwatchLap).elapsed - BigInt(waitFor) * 1000000n));
    else delayTimes.push(lap.elapsed - waitFor)
    console.log(`-- ${`${i + 1}`.padStart(`${times}`.length, ' ')} --`, lap);
  }

  console.log('Offsets:', delayTimes);
  console.log(`Min/Max: ${Math.min(...delayTimes)}/${Math.max(...delayTimes)}  Avg: ${delayTimes.reduce((p, v) => p + v, 0) / delayTimes.length}`)
}

main();
