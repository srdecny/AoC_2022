import { runTests } from "../utils";
import { readFileSync } from "fs";
import { bfsFromNode } from "graphology-traversal";
import Graph from "graphology";

const convertHeight = (label: string): number => {
  if (label === "S") return "a".charCodeAt(0);
  if (label === "E") {
    return "z".charCodeAt(0);
  }
  return label.charCodeAt(0);
};

const parseInput = (input: string): [Graph, string] => {
  const graph = new Graph();
  let startTile;

  const grid = input.split("\n").map((l) => l.split(""));
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const tileKey = `${y}|${x}`;
      const tileLabel = grid[y][x];
      if (tileLabel === "S") {
        startTile = tileKey;
      }
      [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ].forEach(([deltaY, deltaX]) => {
        if (y + deltaY >= 0 && y + deltaY < grid.length) {
          const neighbour = grid[y + deltaY][x + deltaX];
          if (neighbour !== undefined) {
            const neighbourKey = `${y + deltaY}|${x + deltaX}`;
            if (convertHeight(tileLabel) >= convertHeight(neighbour) - 1) {
              graph.mergeNode(tileKey, {
                label: tileLabel,
              });
              graph.mergeNode(neighbourKey, {
                label: neighbour,
              });
              graph.mergeEdge(tileKey, neighbourKey);
            }
          }
        }
      });
    }
  }
  return [graph, startTile];
};

function part1(input: string): number {
  const [graph, start] = parseInput(input);
  let res = 0;
  bfsFromNode(graph, start, (node, attr, depth) => {
    if (attr.label === "E") {
      res = depth;
      return true;
    }
  });
  return res;
}

function part2(input: string): string | number {
  const [graph, start] = parseInput(input);
  const startNodes = graph.filterNodes((node, attr) => {
    return attr.label === "S" || attr.label === "a";
  });

  let res = 10000000;
  startNodes.forEach((start) => {
    bfsFromNode(graph, start, (node, attr, depth) => {
      if (attr.label === "E") {
        if (depth < res) {
          res = depth;
        }
        return true;
      }
    });
  });
  return res;
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
