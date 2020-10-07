export function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max)+1);
}

export function getRandomRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}