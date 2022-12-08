import { runTests, transpose } from "../utils";
import { readFileSync } from "fs";

const parseInput = (input: string): number[][] => {
  return input.split("\n").map((l) => l.split("").map(Number));
};

function part1(input: string): number {
  const rows = parseInput(input);
  const cols = transpose(rows);

  const isVisible = (idx: number, a: number[]): boolean => {
    const before = a.slice(0, idx);
    const after = a.slice(idx + 1);
    const val = a[idx];
    return before.every((e) => e < val) || after.every((e) => e < val);
  };

  let visibleTrees = 0;
  // input is a square
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows.length; x++) {
      if (x == 0 || y == 0 || x == rows.length - 1 || y == rows.length - 1) {
        visibleTrees++;
        continue;
      }
      const row = rows[y];
      const col = cols[x];
      if (isVisible(y, col) || isVisible(x, row)) {
        visibleTrees++;
      }
    }
  }

  return visibleTrees;
}

function part2(input: string): number {
  const rows = parseInput(input);
  const cols = transpose(rows);

  let maxScore = 0;

  const calculateScore = (idx: number, a: number[]): number => {

    const before = a.slice(0, idx).reverse();
    const after = a.slice(idx + 1);
    const val = a[idx]
    const visibleCount = (arr: number[]): number => {
      const blockingIdx = arr.findIndex(n => n >= val)
      return blockingIdx === -1 ? arr.length : blockingIdx + 1
    }
    return visibleCount(before) * visibleCount(after)
  }
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows.length; x++) {
      if (x == 0 || y == 0 || x == rows.length - 1 || y == rows.length - 1) {
        // one of the scores would be 0
        continue;
      }
      const row = rows[y];
      const col = cols[x];
      const score = calculateScore(y, col) * calculateScore(x, row)
      if ( score >= maxScore) {
        maxScore = score
      }
    }
  }
  return maxScore
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
