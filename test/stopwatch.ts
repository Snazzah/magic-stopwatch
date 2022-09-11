import 'mocha';

import * as chai from 'chai';

import { Stopwatch } from '../src';
import { wait } from './__util__';

const expect = chai.expect;

describe('Stopwatch', () => {
  it('options are set correctly', async () => {
    const sw = new Stopwatch();
    expect(sw.laps.length).to.equal(0);
    expect(sw.type).to.equal(typeof performance === 'undefined' ? 'date' : 'performance');
  });

  it('starts on startNow', async () => {
    const sw = new Stopwatch({ startNow: true });
    expect(sw.stopped).to.equal(false);
    expect(sw.startTime).to.not.equal(-1);
  });
});

describe('Stopwatch (date)', function () {
  this.timeout(10000);
  this.slow(4000);

  it('type is set correctly', async () => {
    const sw = new Stopwatch({ type: 'date' });
    expect(sw.type).to.equal('date');
  });

  it('should start properly', async () => {
    const sw = new Stopwatch({ type: 'date' });
    sw.start();
    expect(sw.stopped).to.equal(false);
    expect(sw.startTime).to.not.equal(-1);
  });

  it('should stop properly', async () => {
    const sw = new Stopwatch({ type: 'date', startNow: true });
    await wait(500);
    const lap = sw.stop();
    console.log(`      - Offset: ${lap.elapsed - 500} milliseconds`);
    expect(lap.elapsed).to.be.within(490, 520);
    expect(sw.stopTime).to.not.equal(-1);
  });

  it('should record laps properly', async () => {
    const sw = new Stopwatch({ type: 'date', startNow: true });

    await wait(500);
    const lap1 = sw.lap();
    console.log(`      - Lap 1 Offset: ${lap1.elapsed - 500} milliseconds`);
    expect(lap1.elapsed).to.be.within(490, 520);
    expect(sw.laps[0].elapsed).to.equal(lap1.elapsed);
    expect(sw.laps[0].timestamp).to.equal(lap1.timestamp);

    await wait(500);
    const lap2 = sw.lap();
    console.log(`      - Lap 2 Offset: ${lap2.elapsed - lap1.elapsed - 500} milliseconds`);
    expect(lap2.elapsed - lap1.elapsed).to.be.within(490, 520);
    expect(sw.laps[1].elapsed).to.equal(lap2.elapsed);
    expect(sw.laps[1].timestamp).to.equal(lap2.timestamp);

    await wait(500);
    const lap3 = sw.lap();
    console.log(`      - Lap 3 Offset: ${lap3.elapsed - lap2.elapsed - 500} milliseconds`);
    expect(lap3.elapsed - lap2.elapsed).to.be.within(490, 520);
    expect(sw.laps[2].elapsed).to.equal(lap3.elapsed);
    expect(sw.laps[2].timestamp).to.equal(lap3.timestamp);
  });

  it('should reset properly', async () => {
    const sw = new Stopwatch({ type: 'date', startNow: true });
    sw.stop(true);
    sw.reset();
    expect(sw.stopped).to.equal(true);
    expect(sw.startTime).to.equal(-1);
    expect(sw.stopTime).to.equal(-1);
    expect(sw.elapsed).to.equal(0);
    expect(sw.laps.length).to.equal(0);
  });
});

describe('Stopwatch (performance)', function () {
  this.timeout(10000);
  this.slow(4000);

  it('type is set correctly', async () => {
    const sw = new Stopwatch({ type: 'performance' });
    expect(sw.type).to.equal('performance');
  });

  it('should start properly', async () => {
    const sw = new Stopwatch({ type: 'performance' });
    sw.start();
    expect(sw.stopped).to.equal(false);
    expect(sw.startTime).to.not.equal(-1);
  });

  it('should stop properly', async () => {
    const sw = new Stopwatch({ type: 'performance', startNow: true });
    await wait(500);
    const lap = sw.stop();
    console.log(`      - Offset: ${lap.elapsed - 500} milliseconds`);
    expect(lap.elapsed).to.be.within(490, 520);
    expect(sw.stopTime).to.not.equal(-1);
  });

  it('should record laps properly', async () => {
    const sw = new Stopwatch({ type: 'performance', startNow: true });

    await wait(500);
    const lap1 = sw.lap();
    console.log(`      - Lap 1 Offset: ${lap1.elapsed - 500} milliseconds`);
    expect(lap1.elapsed).to.be.within(490, 520);
    expect(sw.laps[0].elapsed).to.equal(lap1.elapsed);
    expect(sw.laps[0].timestamp).to.equal(lap1.timestamp);

    await wait(500);
    const lap2 = sw.lap();
    console.log(`      - Lap 2 Offset: ${lap2.elapsed - lap1.elapsed - 500} milliseconds`);
    expect(lap2.elapsed - lap1.elapsed).to.be.within(490, 520);
    expect(sw.laps[1].elapsed).to.equal(lap2.elapsed);
    expect(sw.laps[1].timestamp).to.equal(lap2.timestamp);

    await wait(500);
    const lap3 = sw.lap();
    console.log(`      - Lap 3 Offset: ${lap3.elapsed - lap2.elapsed - 500} milliseconds`);
    expect(lap3.elapsed - lap2.elapsed).to.be.within(490, 520);
    expect(sw.laps[2].elapsed).to.equal(lap3.elapsed);
    expect(sw.laps[2].timestamp).to.equal(lap3.timestamp);
  });

  it('should reset properly', async () => {
    const sw = new Stopwatch({ type: 'performance', startNow: true });
    sw.stop(true);
    sw.reset();
    expect(sw.stopped).to.equal(true);
    expect(sw.startTime).to.equal(-1);
    expect(sw.stopTime).to.equal(-1);
    expect(sw.elapsed).to.equal(0);
    expect(sw.laps.length).to.equal(0);
  });
});
