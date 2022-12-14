import { runTests } from "../utils";
import { readFileSync } from "fs";

enum Material {
  AIR,
  ROCK,
  SAND,
}

type Grid = { [key: number]: { [key: number]: Material } };

const parseInput = (input: string): [Grid, number] => {
  const grid: Grid = {};
  let maxY = 0;
  const addRock = (x: number, y: number) => {
    if (!grid[y]) grid[y] = {};
    grid[y][x] = Material.ROCK;
  };
  const processInterval = ([x1, y1]: number[], [x2, y2]: number[]) => {
    if (x1 == x2) {
      const y = [y1, y2];
      y.sort((a, b) => a - b);
      for (let i = y[0]; i <= y[1]; i++) {
        if (maxY < i) maxY = i
        addRock(x1, i);
      }
    }
    if (y1 == y2) {
      const x = [x1, x2];
      x.sort((a, b) => a - b);
      for (let i = x[0]; i <= x[1]; i++) {
        if (maxY < y1) maxY = y1
        addRock(i, y1);
      }
    }
  };
  const intervals = input.split("\n").map((l) =>
    l.split(" -> ").map((interval) => {
      const [x, y] = interval.split(",").map(Number);
      return [x, y];
    })
  );

  intervals.forEach((interval) => {
    for (let i = 0; i < interval.length - 1; i++)
      processInterval(interval[i], interval[i + 1]);
  });
  return [grid, maxY];
};

const dropSand = (grid: Grid, depth: number): boolean => {

  const getMaterial = (x: number, y: number): Material => {
    // pt2 specific
    if (y >= (depth + 2)) return Material.ROCK

    if (!grid[y]) return Material.AIR
    if (!grid[y][x]) return Material.AIR
    return grid[y][x]
  }

  const setMaterial = (x: number, y: number, material: Material) => {
    if (!grid[y]) grid[y] = {}
    grid[y][x] = material
  }


  let [sandX, sandY] = [500, 0]
  // pt2 specfic
  if (getMaterial(500, 0) == Material.SAND) return false
  setMaterial(sandX, sandY, Material.SAND)

  // while (sandY <= depth )
  // pt2 specific
  while (true) {
    if (getMaterial(sandX, sandY + 1) == Material.AIR) {
    // fall down
      setMaterial(sandX, sandY, Material.AIR)
      setMaterial(sandX, sandY + 1, Material.SAND)
      sandY++
    } else if (getMaterial(sandX - 1, sandY + 1) == Material.AIR) {
      // fall left
      setMaterial(sandX, sandY, Material.AIR)
      setMaterial(sandX - 1, sandY + 1, Material.SAND)
      sandY++
      sandX--
    } else if (getMaterial(sandX + 1, sandY + 1) == Material.AIR) {
      // fall right
      setMaterial(sandX, sandY, Material.AIR)
      setMaterial(sandX + 1, sandY + 1, Material.SAND)
      sandY++
      sandX++
    } else {
      // stopped
      return true
    }
  }
  // out of bounds
  return false
}

function part1(input: string): string | number {
  const [grid, depth] = parseInput(input);
  let counter = 0;
  while (dropSand(grid, depth)) {
    counter++
  }
  return counter;
}

function part2(input: string): string | number {
  const [grid, depth] = parseInput(input);
  let counter = 0;
  while (dropSand(grid, depth)) {
    counter++
  }
  return counter;
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
