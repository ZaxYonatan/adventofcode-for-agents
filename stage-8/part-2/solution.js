const { run } = require('../utils');

class UnionFind {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = new Array(size).fill(0);
        this.componentCount = size;
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
        this.componentCount--;
        return true;
    }

    isFullyConnected() {
        return this.componentCount === 1;
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
    logger.info(`Processing ${n} junction boxes`);

    const pairs = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            pairs.push({ i, j, dist: distance(data[i], data[j]) });
        }
    }
    
    pairs.sort((a, b) => a.dist - b.dist);
    logger.info(`Generated ${pairs.length} pairs`);

    const uf = new UnionFind(n);
    let lastConnection = null;

    for (const pair of pairs) {
        if (uf.isFullyConnected()) break;
        
        const merged = uf.union(pair.i, pair.j);
        if (merged) {
            lastConnection = pair;
            logger.debug(`Connected (${data[pair.i].x},${data[pair.i].y},${data[pair.i].z}) to (${data[pair.j].x},${data[pair.j].y},${data[pair.j].z}), dist=${pair.dist.toFixed(2)}, components left: ${uf.componentCount}`);
        }
    }

    const boxA = data[lastConnection.i];
    const boxB = data[lastConnection.j];
    logger.info(`Last connection: (${boxA.x},${boxA.y},${boxA.z}) to (${boxB.x},${boxB.y},${boxB.z})`);

    const result = boxA.x * boxB.x;
    logger.result(result);
    return result;
}

run(solve);

module.exports = { solve };

