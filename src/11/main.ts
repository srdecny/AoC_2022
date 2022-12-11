import { runTests } from "../utils";
import { readFileSync } from "fs";

interface Monkey {
  items: number[];
  inspect: (n: number) => number;
  throwItem: (n: number) => number;
  modulo: number;
}

const parseMonkey = (lines: string): Monkey => {
  const [header, starting, opStr, testStr, t, f] = lines.split("\n");
  const items = starting
    .split(":")[1]
    .replaceAll(" ", "")
    .split(",")
    .map(Number);
  const [first, op, second] = opStr.split("= ")[1].split(" ");
  const inspect =
    second == "old"
      ? (n: number) => n * n
      : op == "+"
      ? (n: number) => n + Number(second)
      : (n: number) => n * Number(second);

  const modulo = Number(testStr.split(" ").at(-1));
  const ifTrue = Number(t.split(" ").at(-1));
  const ifFalse = Number(f.split(" ").at(-1));
  const throwItem = (n: number) => (n % modulo == 0 ? ifTrue : ifFalse);

  return {
    items,
    inspect,
    throwItem,
    modulo,
  };
};

function part1(input: string): number {
  const monkeys = input.split("\n\n").map(parseMonkey);
  const inspectCount = monkeys.map((_) => 0);
  for (let r = 0; r < 20; r++) {
    monkeys.forEach((monkey, idx) => {
      while (monkey.items.length > 0) {
        inspectCount[idx]++;
        let inspectedItem = monkey.items.shift();
        inspectedItem = monkey.inspect(inspectedItem);
        inspectedItem = Math.floor(inspectedItem / 3);
        const destination = monkey.throwItem(inspectedItem);
        monkeys[destination].items.push(inspectedItem);
      }
    });
  }
  inspectCount.sort((a, b) => a - b).reverse();
  return inspectCount[0] * inspectCount[1];
}

function part2(input: string): number {
  const monkeys = input.split("\n\n").map(parseMonkey);
  const moduloTotal = monkeys.map((m) => m.modulo).reduce((acc, c) => acc * c);
  const inspectCount = monkeys.map((_) => 0);
  for (let r = 0; r < 10000; r++) {
    monkeys.forEach((monkey, idx) => {
      while (monkey.items.length > 0) {
        inspectCount[idx]++;
        let inspectedItem = monkey.items.shift();
        inspectedItem = monkey.inspect(inspectedItem);
        inspectedItem = inspectedItem % moduloTotal;
        const destination = monkey.throwItem(inspectedItem);
        monkeys[destination].items.push(inspectedItem);
      }
    });
  }
  inspectCount.sort((a, b) => a - b).reverse();
  return inspectCount[0] * inspectCount[1];
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
