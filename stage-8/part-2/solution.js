const { distance, UnionFind, run } = require("../utils");

function solve(boxes, logger) {
  const n = boxes.length;
  logger.info(`Processing ${n} junction boxes`);

  const pairs = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({
        i,
        j,
        dist: distance(boxes[i], boxes[j]),
      });
    }
  }

  pairs.sort((a, b) => a.dist - b.dist);
  logger.info(`Generated ${pairs.length} pairs`);

  const uf = new UnionFind(n);
  let lastI = -1;
  let lastJ = -1;

  for (let pairIdx = 0; pairIdx < pairs.length; pairIdx++) {
    const { i, j } = pairs[pairIdx];
    const wasUnioned = uf.union(i, j);

    if (wasUnioned) {
      lastI = i;
      lastJ = j;
      logger.debug(`Connected boxes ${i} and ${j}`);
    }

    if (uf.getCircuitCount() === 1) {
      logger.info(`All boxes in one circuit after pair ${pairIdx + 1}`);
      break;
    }
  }

  const boxA = boxes[lastI];
  const boxB = boxes[lastJ];
  logger.info(
    `Last connection: (${boxA.x},${boxA.y},${boxA.z}) and (${boxB.x},${boxB.y},${boxB.z})`
  );

  const result = boxA.x * boxB.x;
  logger.result(result);
  return result;
}

run(solve);
module.exports = { solve };

