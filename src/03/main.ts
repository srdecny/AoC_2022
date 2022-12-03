import { runTests } from "../utils";
import { readFileSync } from "fs";

const getHalves = (input: string) => {
  return input.split("\n").map((line) => {
    const first = line.substring(0, line.length / 2);
    const second = line.substring(line.length / 2);
    return [first, second];
  });
};

const score = (char: string) => {
  const scoreOffset = char.toLowerCase() === char ? 96 : 38;
  return char.charCodeAt(0) - scoreOffset;
};

function part1(input: string): number {
  const halves = getHalves(input);
  const commonInHalves = halves.map(([first, second]) => {
    const common = first.split("").find((char) => second.includes(char));
    return common;
  });
  return commonInHalves.reduce((acc, char) => acc + score(char), 0);
}

function part2(input: string): number {
  const groups: string[][] = input.split("\n").reduce((acc, line, index) => {
    if (index % 3 === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(line);
    return acc;
  }, []);
  const commonInGroups = groups.map(([first, second, third]) => {
    const common = first
      .split("")
      .find((char) => second.includes(char) && third.includes(char));
    return common;
  });
  return commonInGroups.reduce((acc, char) => acc + score(char), 0);
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
