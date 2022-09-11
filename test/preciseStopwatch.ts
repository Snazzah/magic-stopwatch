import 'mocha';

import * as chai from 'chai';

import { PreciseStopwatch } from '../src';
import { wait } from './__util__';

const expect = chai.expect;

describe('PreciseStopwatch', () => {
  it('options are set correctly', async () => {
    const sw = new PreciseStopwatch();
    expect(sw.laps.length).to.equal(0);
    expect(sw.type).to.equal(typeof process === 'undefined' ? 'performance' : 'hrtime');
  });

  it('starts on startNow', async () => {
    const sw = new PreciseStopwatch({ startNow: true });
    expect(sw.stopped).to.equal(false);
    expect(sw.startTime).to.not.equal(-1);
  });
});

describe('PreciseStopwatch (performance)', function () {
  this.timeout(10000);
  this.slow(4000);

  it('type is set correctly', async () => {
    const sw = new PreciseStopwatch({ type: 'performance' });
    expect(sw.type).to.equal('performance');
  });

  it('should start properly', async () => {
    const sw = new PreciseStopwatch({ type: 'performance' });
    sw.start();
    expect(sw.stopped).to.equal(false);
    expect(sw.startTime).to.not.equal(-1);
  });

  it('should stop properly', async () => {
    const sw = new PreciseStopwatch({ type: 'performance', startNow: true });
    await wait(500);
    const lap = sw.stop();
    console.log(`      - Offset: ${lap.elapsed - 500000000n} nanoseconds`);
    expect(Number(lap.elapsed)).to.be.within(490000000, 520000000);
    expect(sw.stopTime).to.not.equal(-1);
  });

  it('should record laps properly', async () => {
    const sw = new PreciseStopwatch({ type: 'performance', startNow: true });

    await wait(500);
    const lap1 = sw.lap();
    console.log(`      - Lap 1 Offset: ${lap1.elapsed - 500000000n} nanoseconds`);
    expect(Number(lap1.elapsed)).to.be.within(490000000, 520000000);
    expect(sw.laps[0].elapsed).to.equal(lap1.elapsed);
    expect(sw.laps[0].timestamp).to.equal(lap1.timestamp);

    await wait(500);
    const lap2 = sw.lap();
    console.log(`      - Lap 2 Offset: ${lap2.elapsed - lap1.elapsed - 500000000n} nanoseconds`);
    expect(Number(lap2.elapsed - lap1.elapsed)).to.be.within(490000000, 520000000);
    expect(sw.laps[1].elapsed).to.equal(lap2.elapsed);
    expect(sw.laps[1].timestamp).to.equal(lap2.timestamp);

    await wait(500);
    const lap3 = sw.lap();
    console.log(`      - Lap 3 Offset: ${lap3.elapsed - lap2.elapsed - 500000000n} nanoseconds`);
    expect(Number(lap3.elapsed - lap2.elapsed)).to.be.within(490000000, 520000000);
    expect(sw.laps[2].elapsed).to.equal(lap3.elapsed);
    expect(sw.laps[2].timestamp).to.equal(lap3.timestamp);
  });

  it('should reset properly', async () => {
    const sw = new PreciseStopwatch({ type: 'performance', startNow: true });
    sw.stop(true);
    sw.reset();
    expect(sw.stopped).to.equal(true);
    expect(sw.startTime).to.equal(-1n);
    expect(sw.stopTime).to.equal(-1n);
    expect(sw.elapsed).to.equal(0n);
    expect(sw.laps.length).to.equal(0);
  });
});

describe('PreciseStopwatch (hrtime)', function () {
  this.timeout(10000);
  this.slow(4000);

  it('type is set correctly', async () => {
    const sw = new PreciseStopwatch({ type: 'hrtime' });
    expect(sw.type).to.equal('hrtime');
  });

  it('should start properly', async () => {
    const sw = new PreciseStopwatch({ type: 'hrtime' });
    sw.start();
    expect(sw.stopped).to.equal(false);
  });

  it('should stop properly', async () => {
    const sw = new PreciseStopwatch({ type: 'hrtime', startNow: true });
    await wait(500);
    const lap = sw.stop();
    console.log(`      - Offset: ${lap.elapsed - 500000000n} nanoseconds`);
    expect(Number(lap.elapsed)).to.be.within(490000000, 520000000);
    expect(sw.stopTime).to.not.equal(-1);
  });

  it('should record laps properly', async () => {
    const sw = new PreciseStopwatch({ type: 'hrtime', startNow: true });

    await wait(500);
    const lap1 = sw.lap();
    console.log(`      - Lap 1 Offset: ${lap1.elapsed - 500000000n} nanoseconds`);
    expect(Number(lap1.elapsed)).to.be.within(490000000, 520000000);
    expect(sw.laps[0].elapsed).to.equal(lap1.elapsed);
    expect(sw.laps[0].timestamp).to.equal(lap1.timestamp);

    await wait(500);
    const lap2 = sw.lap();
    console.log(`      - Lap 2 Offset: ${lap2.elapsed - lap1.elapsed - 500000000n} nanoseconds`);
    expect(Number(lap2.elapsed - lap1.elapsed)).to.be.within(490000000, 520000000);
    expect(sw.laps[1].elapsed).to.equal(lap2.elapsed);
    expect(sw.laps[1].timestamp).to.equal(lap2.timestamp);

    await wait(500);
    const lap3 = sw.lap();
    console.log(`      - Lap 3 Offset: ${lap3.elapsed - lap2.elapsed - 500000000n} nanoseconds`);
    expect(Number(lap3.elapsed - lap2.elapsed)).to.be.within(490000000, 520000000);
    expect(sw.laps[2].elapsed).to.equal(lap3.elapsed);
    expect(sw.laps[2].timestamp).to.equal(lap3.timestamp);
  });

  it('should reset properly', async () => {
    const sw = new PreciseStopwatch({ type: 'hrtime', startNow: true });
    sw.stop(true);
    sw.reset();
    expect(sw.stopped).to.equal(true);
    expect(sw.startTime).to.equal(-1n);
    expect(sw.stopTime).to.equal(-1n);
    expect(sw.elapsed).to.equal(0n);
    expect(sw.laps.length).to.equal(0);
  });
});
