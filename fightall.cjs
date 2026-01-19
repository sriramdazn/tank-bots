const fs = require('fs');
const path = require("path");

const run = require("./rungame.cjs");

function processElo(a, b, winner, elo) {
    let scoreA;

    if (winner === "A") scoreA = 1;
    else if (winner === "B") scoreA = 0;
    else scoreA = 0.5;

    const [newA, newB] = updateElo(
        elo[a],
        elo[b],
        scoreA
    );

    elo[a] = newA;
    elo[b] = newB;
}

function updateElo(ratingA, ratingB, scoreA, k = 32) {
    const expectedA =
        1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));

    const newA = ratingA + k * (scoreA - expectedA);
    const newB = ratingB + k * ((1 - scoreA) - (1 - expectedA));

    return [Math.round(newA), Math.round(newB)];
}


function findAllFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            findAllFiles(fullPath, files);
        } else if (entry.isFile()) {
            files.push(entry.name);
        }
    }

    return files;
}

const absPath = path.resolve("bots/");

if (!fs.existsSync(absPath)) {
    console.error("Folder does not exist:", absPath);
    process.exit(1);
}

const result = findAllFiles(absPath);
const wins = {};
const elo = {};

for (const entry of result) {

    wins[entry] = 0;
    elo[entry] = 1200;
}

const matches = [];
for (let i = 0; i < result.length; i++) {
    // const fullPath = path.join(dir, entry.name);

    const file1 =  result[i];
    for(j = i + 1; j < result.length; j++) {
        const file2 =  result[j];

        for (let k = 0;k < 50;k++){
            const {winner, gameData} = run(path.join(absPath, file1), path.join(absPath, file2));
            const matchName  = `${file1}-${file2}-${k}`;
            matches.push({
                A: file1,B: file2, winner: winner,name: matchName
            });

            processElo(file1, file2, winner, elo)

            if (winner === "A") wins[file1]++;
            else if (winner === "B") wins[file2]++;

            fs.writeFileSync(
                `src/matches/${matchName}.json`,
                JSON.stringify(gameData, null, 2),
                'utf-8'
            );
        }

    }
}

console.log("matches", matches);
console.log("wins", wins, elo);

fs.writeFileSync(
    `src/matches.json`,
    JSON.stringify(matches, null, 2),
    'utf-8'
);
fs.writeFileSync(
    `src/wins.json`,
    JSON.stringify(Object.keys(wins).map(m => ({ wins: wins[m], elo: elo[m], name: m })), null, 2),
    'utf-8'
);