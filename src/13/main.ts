import { runTests } from "../utils";
import { readFileSync } from "fs";

enum OrderResult {
  NAYNAY = 0,
  GUCCI = 1,
  IDK = 2,
}

const isOrderedCorrectly = (left: any, right: any): OrderResult => {
  if (typeof left == "number" && typeof right == "number") {
    if (left < right) return OrderResult.GUCCI;
    if (left > right) return OrderResult.NAYNAY;
    return OrderResult.IDK;
  } else if (typeof left == "object" && typeof right == "object") {
    const copyLeft = JSON.parse(JSON.stringify(left));
    const copyRight = JSON.parse(JSON.stringify(right));
    while (copyLeft.length > 0 && copyRight.length > 0) {
      const res = isOrderedCorrectly(copyLeft.shift(), copyRight.shift());
      if (res !== OrderResult.IDK) return res;
    }

    if (copyLeft.length === 0 && copyRight.length > 0) return OrderResult.GUCCI;
    else if (copyRight.length === 0 && copyLeft.length > 0)
      return OrderResult.NAYNAY;
    else return OrderResult.IDK;
  } else if (typeof left == "number") {
    return isOrderedCorrectly([left], right);
  } else if (typeof right == "number") {
    return isOrderedCorrectly(left, [right]);
  } else {
    throw Error("WeirdChamp");
  }
};

function part1(input: string): number {
  const groups = input
    .split("\n\n")
    .map((p) => p.split("\n").map((l) => JSON.parse(l)));

  return groups
    .map(([l1, l2], idx) => {
      const res = isOrderedCorrectly(l1, l2);
      return res === OrderResult.GUCCI ? idx + 1 : 0;
    })
    .reduce((acc, c) => acc + c);
}

function part2(input: string): number {
  const packets = input
    .replaceAll("\n\n", "\n")
    .split("\n")
    .map((l) => JSON.parse(l))
    .concat([[[2]], [[6]]]);
  packets.sort((first, second) =>
    isOrderedCorrectly(first, second) == OrderResult.GUCCI ? -1 : 1
  );
  return ["[[2]]", "[[6]]"]
    .map((keyPacket) => {
      return packets.findIndex((e) => JSON.stringify(e) == keyPacket) + 1;
    })
    .reduce((acc, c) => acc * c);
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
