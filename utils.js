const randomRange = (min, max) => {
    return Math.floor((Math.random() * (max - min)) + min)
}

const getRandom = array => {
    const index = randomRange(0, array.length)
    return {
        element: array[index],
        index
    }
}

module.exports = {
    randomRange,
    getRandom
}