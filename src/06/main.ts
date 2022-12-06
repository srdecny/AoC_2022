import { runTests } from "../utils";
import { readFileSync } from "fs";

function part1(input: string): number {
	for (let i = 0; i < input.length - 3; i++) {
		const window = input.slice(i, i + 4)
		if ([...new Set(window)].length == 4) return i + 4;
	}
}

function part2(input: string): string|number {
	for (let i = 0; i < input.length - 13; i++) {
		const window = input.slice(i, i + 14)
		if ([...new Set(window)].length == 14) return i + 14;
	}
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));