import { runTests } from "../utils";
import { readFileSync } from "fs";


const parseInput = (lines: string): number[] => {
	return lines.split("\n\n").map(elf => {
		return elf.split("\n").map(Number).reduce((a, b) => a + b);
	})
}

function part1(input: string): number {
	const kcals = parseInput(input);
	return Math.max(...kcals)
}

function part2(input: string): number {
	const kcals = parseInput(input);
	kcals.sort((a, b) => b - a);
	return kcals.slice(0, 3).reduce((a, b) => a + b);
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));