import { runTests } from "../utils";
import { readFileSync } from "fs";
import { countReset, time } from "console";

function part1(input: string): number {
  const instructions = input.split("\n");
  let cycle = 1;
  let X = 1;
  let pc = 0;
  let sum = 0;
  let str = [];
  while (pc < instructions.length) {
    const instruction = instructions[pc];
    let cyclesToFinish = 0;
    let toIncrease = 0;
    if (instruction == "noop") {
      cyclesToFinish = 1;
    }
    if (instruction.startsWith("addx")) {
      const count = Number(instruction.split(" ")[1]);
      cyclesToFinish = 2;
      toIncrease = count;
    }

    while (cyclesToFinish > 0) {
      const currentIdx = (cycle % 40) - 1;
      str.push(Math.abs(currentIdx - X) >= 2 ? " " : "#");
      if (cycle % 40 == 20) {
        sum += X * cycle;
      }
      cycle++;
      cyclesToFinish--;
    }
    X += toIncrease;
    pc++;
  }

  for (let i = 0; i < str.length; i += 40) {
    const row = str.slice(i, i + 40);
    console.log(row.join(""));
  }
  return sum;
}

function part2(input: string): string | number {
  return "";
}

function part1_alt(input: string): number {
  const modifiedInput = input
    .replaceAll(/addx (-?\d+)/g, "0\n$1")
    .replaceAll(/noop/g, "0")
    .split("\n")
    .map(Number);
  const res = modifiedInput.reduce(
    (acc, n, idx) => {
      const currentIdx = idx % 40;
      acc.crt.push(Math.abs(currentIdx - acc.x) >= 2 ? " " : "□");
      if ((idx + 1) % 40 == 20) {
        acc.total += (idx + 1) * acc.x;
      }
      acc.x += n;
      return acc;
    },
    { x: 1, total: 0, crt: [] }
  );

  for (let i = 0; i < res.crt.length; i += 40) {
    const row = res.crt.slice(i, i + 40);
    console.log(row.join(""));
  }
  return res.total;
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 1 (alt): " + part1_alt(input));

// 14340 too high
