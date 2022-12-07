import { runTests } from "../utils";
import { readFileSync } from "fs";

const FS_SIZE = 70000000;
const FS_TRESHOLD = 30000000;

type Command = string[];
interface File {
  name: string;
  size: number;
}
interface Directory {
  parent?: Directory;
  files: File[];
  childrens: { [key: string]: Directory };
  fileSize: number;
}

const parseCommands = (input: string): Command[] => {
  return input.split("\n").reduce((acc, line) => {
    if (line.startsWith("$")) {
      acc.push([]);
    }
    acc[acc.length - 1].push(line);
    return acc;
  }, []);
};

const buildDirTree = (commands: Command[]) => {
  const rootDir: Directory = {
    parent: undefined,
    files: [],
    fileSize: 0,
    childrens: {},
  };
  commands.reduce((acc, c) => {
    if (c[0] === "$ cd /") {
      return rootDir;
    }
    if (c[0] === "$ ls") {
      const content = c.slice(1).map((l) => l.split(" "));
      const files = content.filter((l) => l[0].match(/\d+/));
      const dirs = content.filter((l) => l[0] === "dir");

      acc.files = files.map(([size, name]) => {
        return {
          size: Number(size),
          name,
        };
      });
      acc.fileSize = acc.files.reduce((acc, c) => acc + c.size, 0);
      acc.childrens = dirs.reduce((dirAcc, [, name]) => {
        dirAcc[name] = {
          parent: acc,
          files: [],
          childrens: {},
          fileSize: 0,
        };
        return dirAcc;
      }, {} as Directory["childrens"]);
      return acc;
    }
    if (c[0] === "$ cd ..") {
      return acc.parent;
    }
    if (c[0].match(/cd \w+/)) {
      const [, , newDirName] = c[0].split(" ");
      return acc.childrens[newDirName];
    }
  }, rootDir);
  return rootDir;
};

const sumDir = (dir: Directory): number => {
  const sumChilds = Object.values(dir.childrens).reduce(
    (acc, c) => acc + sumDir(c),
    0
  );
  return dir.fileSize + sumChilds;
};

const isDirSmall = (dir: Directory): boolean => {
  let totalSum = dir.fileSize;
  totalSum += Object.values(dir.childrens).reduce(
    (acc, c) => acc + sumDir(c),
    0
  );
  return totalSum < 100000;
};

const sumSmallDirs = (dir: Directory, cumSum: number): number => {
  if (isDirSmall(dir)) cumSum += sumDir(dir);
  return Object.values(dir.childrens).reduce((sum, child) => {
    return sumSmallDirs(child, sum);
  }, cumSum);
};

const findDirToDelete = (
  unusedSpace: number,
  dir: Directory,
  smallestToDeleteSize: number
): number => {
  const dirSize = sumDir(dir);
  const smallestInChildren = Object.values(dir.childrens).reduce(
    (size, child) => {
      return findDirToDelete(unusedSpace, child, size);
    },
    smallestToDeleteSize
  );

  const isViable = (dirSize: number) =>
    unusedSpace + dirSize >= FS_TRESHOLD && smallestToDeleteSize > dirSize;
  if (isViable(dirSize) && dirSize < smallestInChildren) {
    return dirSize;
  }
  return smallestInChildren;
};

function part1(input: string): number {
  const groups = parseCommands(input);
  const root = buildDirTree(groups);
  return sumSmallDirs(root, 0);
}

function part2(input: string): number {
  const groups = parseCommands(input);
  const root = buildDirTree(groups);
  const unusedSpace = FS_SIZE - sumDir(root);
  return findDirToDelete(unusedSpace, root, FS_SIZE);
}

runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));
