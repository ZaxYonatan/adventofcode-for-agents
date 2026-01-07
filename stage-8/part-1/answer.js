const fs = require('fs');
const path = require('path');
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
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
        if (rootX === rootY) {
            return false;
        }
        if (this.size[rootX] < this.size[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];
        }
        else {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        }
        return true;
    }
    getSize(x) {
        return this.size[this.find(x)];
    }
    getCircuitSizes() {
        const rootSizes = new Map();
        for (let i = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            rootSizes.set(root, this.size[root]);
        }
        return Array.from(rootSizes.values()).sort((a, b) => b - a);
    }
}
function parseInput(inputPath) {
    const content = fs.readFileSync(inputPath, 'utf-8');
    const lines = content.trim().split('\n');
    return lines.map((line) => {
        const [x, y, z] = line.split(',').map(Number);
        return { x, y, z };
    });
}
function calculateDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function solve(points, connectionsToMake) {
    const connections = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const distance = calculateDistance(points[i], points[j]);
            connections.push({ from: i, to: j, distance });
        }
    }
    connections.sort((a, b) => a.distance - b.distance);
    const uf = new UnionFind(points.length);
    let connectionsMade = 0;
    for (const connection of connections) {
        if (connectionsMade >= connectionsToMake) {
            break;
        }
        if (uf.union(connection.from, connection.to)) {
            connectionsMade++;
        }
    }
    const circuitSizes = uf.getCircuitSizes();
    const threeLargest = circuitSizes.slice(0, 3);
    return threeLargest.reduce((product, size) => product * size, 1);
}
const examplePath = path.join(__dirname, '../input.example');
const realPath = path.join(__dirname, '../input.real');
const examplePoints = parseInput(examplePath);
const exampleResult = solve(examplePoints, 10);
console.log(`Example result: ${exampleResult}`);
if (exampleResult !== 40) {
    console.error(`Example validation failed: expected 40, got ${exampleResult}`);
    process.exit(1);
}
const realPoints = parseInput(realPath);
const realResult = solve(realPoints, 1000);
console.log(`Real answer: ${realResult}`);
