const { run } = require('../utils');

class UnionFind {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = new Array(size).fill(0);
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
        return true;
    }

    getCircuitSizes() {
        const sizes = new Map();
        for (let i = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            sizes.set(root, (sizes.get(root) || 0) + 1);
        }
        return Array.from(sizes.values()).sort((a, b) => b - a);
    }
}

function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function solve(data, logger) {
    const n = data.length;
    const connectionsToMake = n === 20 ? 10 : 1000;

    logger.info(`Processing ${n} junction boxes`);
    logger.info(`Will make ${connectionsToMake} connections`);

    const pairs = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            pairs.push({ i, j, dist: distance(data[i], data[j]) });
        }
    }
    
    pairs.sort((a, b) => a.dist - b.dist);
    logger.info(`Generated ${pairs.length} pairs`);

    const uf = new UnionFind(n);
    let connectionsMade = 0;

    for (const pair of pairs) {
        if (connectionsMade >= connectionsToMake) break;
        uf.union(pair.i, pair.j);
        connectionsMade++;
        logger.debug(`Connected ${pair.i} (${data[pair.i].x},${data[pair.i].y},${data[pair.i].z}) to ${pair.j} (${data[pair.j].x},${data[pair.j].y},${data[pair.j].z}), dist=${pair.dist.toFixed(2)}`);
    }

    const sizes = uf.getCircuitSizes();
    logger.info(`Circuit sizes (top 10): ${sizes.slice(0, 10).join(', ')}`);

    const result = sizes[0] * sizes[1] * sizes[2];
    logger.result(result);
    return result;
}

run(solve);

module.exports = { solve };

