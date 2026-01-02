const fs = require("fs");

function createLogger(verbose) {
  return {
    debug: (msg) => verbose && console.log(`[DEBUG] ${msg}`),
    info: (msg) => verbose && console.log(`[INFO] ${msg}`),
    result: (val) => console.log(`Answer: ${val}`),
  };
}

function parseInput(rawText) {
  return rawText
    .trim()
    .split("\n")
    .map((line) => {
      const [x, y, z] = line.split(",").map(Number);
      return { x, y, z };
    });
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.size = Array(n).fill(1);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }
    return true;
  }

  getSize(x) {
    return this.size[this.find(x)];
  }

  getCircuitSizes() {
    const sizes = new Map();
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      if (!sizes.has(root)) {
        sizes.set(root, this.size[root]);
      }
    }
    return Array.from(sizes.values());
  }

  getCircuitCount() {
    const roots = new Set();
    for (let i = 0; i < this.parent.length; i++) {
      roots.add(this.find(i));
    }
    return roots.size;
  }
}

function run(solveFunction) {
  const args = process.argv.slice(2);
  const verbose = args.includes("--verbose") || args.includes("-v");
  const inputFile = args.find((arg) => !arg.startsWith("-"));

  if (!inputFile || args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node solution.js <input-file> [--verbose]");
    process.exit(1);
  }

  const rawText = fs.readFileSync(inputFile, "utf-8");
  const logger = createLogger(verbose);
  const data = parseInput(rawText);
  solveFunction(data, logger);
  process.exit(0);
}

module.exports = { createLogger, parseInput, distance, UnionFind, run };

