import { runTests, range } from "../utils";
import { readFileSync } from "fs";

interface Coords {
  X: number;
  Y: number;
}

const moveTo = (head: Coords, tail: Coords) => {
  if (Math.abs(head.X - tail.X) >= 2) {
    tail.X += head.X > tail.X ? 1 : -1;

    if (Math.abs(head.Y - tail.Y) >= 1) {
      tail.Y += head.Y > tail.Y ? 1 : -1;
    }

  } else if (Math.abs(head.Y - tail.Y) >= 2) {
    tail.Y += head.Y > tail.Y ? 1 : -1;

    if (Math.abs(head.X - tail.X) >= 1) {
      tail.X += head.X > tail.X ? 1 : -1;
    }
  }
};

function solve(input: string, chainLength: number): number {
  const visited: { [key: number]: Set<number> } = {};

  const initCoords = (): Coords => {
    return {
      X: 0,
      Y: 0,
    };
  };

  let chain = range(0, chainLength - 1).map(_ => initCoords())

  const moveChain = () => {
    for (let i = 0; i < chain.length - 1; i++) {
      moveTo(chain[i], chain[i + 1]);
    }
  };

  const print = () => {
    for (let y = 0; y < 6; y++) {
      const str = [];
      for (let x = 0; x < 6; x++) {
        if (visited[y]?.has(x)) {
          str.push("#");
        } else {
          str.push(".");
        }
      }
      console.log(str.join(""));
    }
    console.log("   ");
  };

  input.split("\n").forEach((line) => {
    const [cmd, repeat] = line.split(" ");
    for (let i = 0; i < Number(repeat); i++) {
      switch (cmd) {
        case "L":
          chain[0].X--;
          break;
        case "R":
          chain[0].X++;
          break;
        case "U":
          chain[0].Y++;
          break;
        case "D":
          chain[0].Y--;
          break;
      }
      moveChain();
      let tail = chain.at(-1);
      if (!visited[tail.Y]) {
        visited[tail.Y] = new Set();
      }
      visited[tail.Y].add(tail.X);
    }
  });
  return Object.values(visited)
    .map((v) => v.size)
    .reduce((acc, c) => acc + c, 0);
}

function part1(input: string): string | number {
  return solve(input, 2)
}
function part2(input: string): string | number {
  return solve(input, 10)
}
runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));

// 6189 low
