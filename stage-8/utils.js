const fs = require('fs');

function createLogger(verbose) {
    return {
        debug: (msg) => verbose && console.log(`[DEBUG] ${msg}`),
        info: (msg) => verbose && console.log(`[INFO] ${msg}`),
        result: (val) => console.log(`Answer: ${val}`)
    };
}

function parseInput(rawText) {
    return rawText.trim().split('\n').map(line => {
        const [x, y, z] = line.split(',').map(Number);
        return { x, y, z };
    });
}

function run(solveFunction) {
    const args = process.argv.slice(2);
    const verbose = args.includes('--verbose') || args.includes('-v');
    const inputFile = args.find(arg => !arg.startsWith('-'));

    if (!inputFile || args.includes('--help') || args.includes('-h')) {
        console.log('Usage: node solution.js <input-file> [--verbose]');
        process.exit(1);
    }

    const rawText = fs.readFileSync(inputFile, 'utf-8');
    const logger = createLogger(verbose);
    const data = parseInput(rawText);
    solveFunction(data, logger);
    process.exit(0);
}

module.exports = { createLogger, parseInput, run };

