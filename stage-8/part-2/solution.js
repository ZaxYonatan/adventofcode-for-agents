#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class UnionFind {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = Array(size).fill(0);
        this.numCircuits = size;
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
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        this.numCircuits--;
        return true;
    }
}

function parseInput(input) {
    return input.trim().split('\n').map(line => {
        const [x, y, z] = line.split(',').map(Number);
        return { x, y, z };
    });
}

function distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
}

function solve(input) {
    const boxes = parseInput(input);
    const n = boxes.length;

    const pairs = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            pairs.push({
                i,
                j,
                dist: distanceSquared(boxes[i], boxes[j])
            });
        }
    }

    pairs.sort((a, b) => a.dist - b.dist);

    const uf = new UnionFind(n);
    let lastConnection = null;

    for (const pair of pairs) {
        if (uf.union(pair.i, pair.j)) {
            lastConnection = pair;
            if (uf.numCircuits === 1) break;
        }
    }

    return boxes[lastConnection.i].x * boxes[lastConnection.j].x;
}

function main() {
    const startTime = process.hrtime.bigint();

    const scriptDir = path.dirname(__filename);

    const exampleInput = fs.readFileSync(path.join(scriptDir, '../input.example'), 'utf8');
    const exampleResult = solve(exampleInput);
    console.log('Example:', exampleResult, '(expected: 25272, match:', exampleResult === 25272, ')');

    const realInput = fs.readFileSync(path.join(scriptDir, '../input.real'), 'utf8');
    const answer = solve(realInput);
    console.log('Answer:', answer);

    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    console.log('Duration:', durationMs.toFixed(2), 'ms');
}

main();
