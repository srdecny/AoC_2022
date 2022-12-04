import { runTests } from "../utils";
import { readFileSync } from "fs";

interface WorkerPair {
  firstFrom: number;
  firstTo: number;
  secondFrom: number;
  secondTo: number;
}
const parseInput = (input: string): WorkerPair[] => {
  return input.split("\n").map((line) => {
    const [firstFrom, firstTo, secondFrom, secondTo] = line
      .replaceAll("-", ",")
      .split(",")
      .map((num) => parseInt(num));
    return { firstFrom, firstTo, secondFrom, secondTo } as WorkerPair;
  });
};

function part1(input: string): number {
	const pairs = parseInput(input);
	const overlappingPairs = pairs.filter(pair => {
		return (pair.firstFrom >= pair.secondFrom && pair.firstTo <= pair.secondTo) ||
			(pair.secondFrom >= pair.firstFrom && pair.secondTo <= pair.firstTo);
	})
	return overlappingPairs.length;
}

function part2(input: string): number {
	const pairs = parseInput(input);
	const overlappingPairs = pairs.filter(pair => {
		return (pair.firstFrom <= pair.secondTo) && (pair.secondFrom <= pair.firstTo); 
	})
	return overlappingPairs.length
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
