export function isObjectPosition(object, x, y ){
    return object.position[0] == x && object.position[1] == y;
}


export function processElo(a, b, winner, elo) {
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

export function updateElo(ratingA, ratingB, scoreA, k = 32) {
    const expectedA =
        1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));

    const newA = ratingA + k * (scoreA - expectedA);
    const newB = ratingB + k * ((1 - scoreA) - (1 - expectedA));

    return [Math.round(newA), Math.round(newB)];
}
