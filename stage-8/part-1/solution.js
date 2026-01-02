const { distance, UnionFind, run } = require("../utils");

function solve(boxes, logger, numPairs = 1000) {
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

  for (let pairIdx = 0; pairIdx < numPairs && pairIdx < pairs.length; pairIdx++) {
    const { i, j } = pairs[pairIdx];
    const wasUnioned = uf.union(i, j);
    logger.debug(
      `Pair ${pairIdx + 1}: boxes ${i} and ${j} - ${wasUnioned ? "connected" : "already same circuit"}`
    );
  }

  const sizes = uf.getCircuitSizes();
  sizes.sort((a, b) => b - a);

  logger.info(`Circuit sizes: ${sizes.slice(0, 10).join(", ")}...`);

  const result = sizes[0] * sizes[1] * sizes[2];
  logger.result(result);
  return result;
}

run(solve);
module.exports = { solve };
