class Timer {
    #enabled
    #interval

    constructor(keyword, handler, delay, enabled) {
        this.keyword = keyword
        this.handler = handler
        this.delay = delay
        this.setEnabled(enabled)
    }

    setEnabled(enabled) {
        this.#enabled = enabled
        clearInterval(this.#interval)
        if (this.#enabled) {
            this.#interval = setInterval(this.handler, this.delay)
        }
    }

    reset() {
        if (this.#enabled) {
            clearInterval(this.#interval)
            this.#interval = setInterval(this.handler, this.delay)
        }
    }
}

module.exports = Timer