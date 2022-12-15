import { runTests } from "../utils";
import { readFileSync } from "fs";

interface Sensor {
  x: number;
  y: number;
  beaconX: number;
  beaconY: number;
}

const parseInput = (input: string): Sensor[] => {
  return input.split("\n").map((line) => {
    const [x, y, beaconX, beaconY] = line
      .match(/.*=(-?\d+).*=(-?\d+).*=(-?\d+).*=(-?\d+)/)
      .splice(1)
      .map(Number);
    return { x, y, beaconX, beaconY };
  });
};

const computeXIntervals = (s: Sensor, y: number): [number?, number?] => {
  const beaconRange = Math.abs(s.x - s.beaconX) + Math.abs(s.y - s.beaconY);
  const yDiff = Math.abs(y - s.y);
  const xHalf = beaconRange - yDiff;
  if (xHalf < 0) return [undefined, undefined];
  const xInterval = [s.x - xHalf, s.x + xHalf];
  xInterval.sort((a, b) => a - b);
  return [xInterval[0], xInterval[1]];
};

const part1 =
  (Y: number) =>
  (input: string): number => {
    const sensors = parseInput(input);
    const intervals = sensors.map((s) => computeXIntervals(s, Y));

    const intervalOverlap = intervals.reduce((acc, c) => {
      if (c[0] == undefined) return acc;
      for (let i = c[0]; i <= c[1]; i++) {
        acc.add(i);
      }
      return acc;
    }, new Set());

    const beaconsOnY = sensors.filter((s) => s.beaconY == Y);
    const uniqueBeacons = new Set(
      beaconsOnY.map((b) => `${b.beaconX}|${b.beaconY}`)
    ).size;
    return intervalOverlap.size - uniqueBeacons;
  };

const part2 =
  (lower: number, upper: number) =>
  (input: string): number => {
    const sensors = parseInput(input);
    for (let y = lower; y <= upper; y++) {
      const intervals = sensors
        .map((s) => computeXIntervals(s, y))
        .filter((i) => i[0] !== undefined)
        .map((i) => {
          return [i[0] < 0 ? 0 : i[0], i[1]];
        });
      intervals.sort((a, b) => a[0] - b[0]);

      const elementsOnRow = sensors.reduce((acc, s) => {
        if (s.beaconY == y) acc.add(s.beaconX);
        if (s.y == y) acc.add(s.y);
        return acc;
      }, new Set<number>());

      let xLower = 0;
      let elementsMissing = new Set<number>();
      intervals.forEach(([from, to]) => {
        if (xLower < from - 1) {
          for (
            let missing = xLower + 1;
            missing < from;
            missing++
          ) {
            elementsMissing.add(missing);
          }
        }
        if (xLower <= to) xLower = to;
      });

      [...elementsOnRow.values()].forEach((element) => {
        elementsMissing.delete(element);
      });

      if (elementsMissing.size > 0) {
        const x = [...elementsMissing.values()][0];
        return x * 4000000 + y;
      }
    }
  };

runTests("tests.json", part1(10), part2(0, 20));
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(2000000)(input));
console.log("Part 2: " + part2(0, 4000000)(input));

// 5099316 too high
