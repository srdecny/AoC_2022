import { runTests } from "../utils";
import { readFileSync } from "fs";

const score = (round: string): number => {
	switch (round) {
		case "A X": // rock, rock
			return 4;
		case "A Y": // rock, paper
			return 8;
		case "A Z": // rock, scissors
			return 3;
		case "B X": // paper, rock
			return 1;
		case "B Y": // paper, paper
			return 5;
		case "B Z": // paper, scissors
			return 9;
		case "C X": // scissors, rock
			return 7;
		case "C Y": // scissors, paper
			return 2;
		case "C Z": // scissors, scissors
			return 6;
		
	}
}

function part1(input: string): string|number {
	const rounds = input.split("\n")
	const points = rounds.map(round => score(round))
	return points.reduce((a, b) => a + b, 0);
}

function part2(input: string): string|number {
	const rounds = input.split("\n")
	const points = rounds.map(round => {
		switch (round) {
			case "A X": // rock, lose
				return score("A Z"); // rock, scissors
			case "A Y": // rock, draw
				return score("A X"); // rock, rock
			case "A Z": // rock, win
				return score("A Y"); // rock, paper
			case "B X": // paper, lose
				return score("B X"); // paper, rock
			case "B Y": // paper, draw
				return score("B Y"); // paper, paper
			case "B Z": // paper, win
				return score("B Z"); // paper, scissosrs
			case "C X": // scissors, lose
				return score("C Y"); // scissors, paper
			case "C Y": // scissors, draw
				return score("C Z"); // scissors, scissors
			case "C Z": // scissors, win
				return score("C X"); // scissors, rock
		}
	})
	return points.reduce((a, b) => a + b, 0);

}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));