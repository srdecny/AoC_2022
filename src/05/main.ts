import { runTests, transpose } from "../utils";
import { readFileSync } from "fs";

type Stack = string[];

interface Instruction {
  count: number;
  from: number;
  to: number;
}

const parseInput = (input: string): [Stack[], Instruction[]] => {
  const [stackStr, instructionStr] = input.split("\n\n");
  const stackLines = stackStr
    .split("\n")
    .slice(0, -1)
    .map((line) => {
      return line
        .replaceAll("]", ",")
        .replaceAll("[", "")
        .replaceAll(" ", "")
        .split(",")
        .slice(0, -1);
    });
  // Line looks like this: [_] [D] [_]
  const stacks: Stack[] = transpose(stackLines).map((line) => {
    return line.filter((i) => i != "_");
  });

  const instructions = instructionStr.split("\n").map((line) => {
    const [count, from, to] = line
      .match(/move (\d+) from (\d+) to (\d+)/)
      .slice(1)
      .map(Number)
      .map((n, idx) => idx > 0 ? n - 1 : n); // convert from 1-based indexing
    return { count, from, to } as Instruction;
  });

  return [stacks, instructions];
};

function part1(input: string): string {
  const [stacks, instructions] = parseInput(input);
  instructions.forEach((ins) => {
    for (let i = 0; i < ins.count; i++) {
      stacks[ins.to].unshift(stacks[ins.from].shift());
    }
  });
  return stacks.map((s) => s.shift()).join("");
}

function part2(input: string): string | number {
  const [stacks, instructions] = parseInput(input);
  instructions.forEach((ins) => {
    const moved = stacks[ins.from].splice(0, ins.count)
    stacks[ins.to] = moved.concat(stacks[ins.to])
  });
  return stacks.map((s) => s.shift()).join("");
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
