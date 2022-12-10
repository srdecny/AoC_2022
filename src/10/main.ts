import { runTests } from "../utils";
import { readFileSync } from "fs";
import { countReset, time } from "console";

function part1(input: string): number {
	const instructions = input.split("\n")
	let cycle = 1
	let X = 1
	let pc = 0
	let sum = 0
	let str = []
	while (pc < instructions.length) {
		const instruction = instructions[pc]
		let cyclesToFinish = 0
		let toIncrease = 0
		if (instruction == "noop") {
			cyclesToFinish = 1
		}
		if (instruction.startsWith("addx")) {
			const count = Number(instruction.split(" ")[1])
			cyclesToFinish = 2
			toIncrease = count
		}

		while (cyclesToFinish > 0) {
			const currentIdx = (cycle % 40) - 1
			str.push(Math.abs(currentIdx - X) >= 2 ? " " : "#")
			if (cycle % 40 == 20) {
				sum += X * cycle
			}
			cycle++
			cyclesToFinish--
		}
		X += toIncrease
		pc++
	}

	for (let i = 0; i < str.length; i += 40) {
		const row = str.slice(i, i + 40)
		console.log(row.join(""))
	}
	return sum
}

function part2(input: string): string|number {
	return "";
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));

// 14340 too high