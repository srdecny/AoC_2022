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

// match 0 char, group with 1 char, match length - 1 chars
// match 1 char, group with 1 char, match length - 2 chars
// ...
// the group is the item we're checking
// it is either (.) if in the irst half or \1 in the second half
function* allPositions(length: number) {
	for (let i = 0; i < length; i++) {
		const prefix = `.{${i}}`
		const postfix = `.{${length - i - 1}}`
		yield (group: string) => prefix + group + postfix
	}
}

function part1_alt(input: string): number {
	const lengths = [...new Set(input.split("\n").map(line => line.length))]
	let groupCounter = 1;
	const regexesForLengths = lengths.map(fullLength => {
		const halfLength = fullLength / 2
		const regexes = []
		for (const firstHalf of allPositions(halfLength)) {
			for (const secondHalf of allPositions(halfLength)) {
				regexes.push(firstHalf("(.)") + secondHalf(`\\${groupCounter++}`))
			}
		}
		return regexes.map(r => `^${r}$`).join("|")
	})
	const regex = new RegExp(regexesForLengths.join("|"))
	const matches = input.split("\n").map(line => line.match(regex).splice(1).find(x => x))
	return matches.reduce((acc, match) => acc + score(match[0]), 0)
}

// alternate part2 solution
function part2_alt(input: string): number {
  return input.replaceAll(/.*(.).*\n.*\1.*\n.*\1.*/g, "$1").split("\n").reduce((acc, char) => acc + score(char), 0);
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 1 (alt): " + part1_alt(input));
console.log("Part 2: " + part2(input));
console.log("Part 2 (alt): " + part2_alt(input));
