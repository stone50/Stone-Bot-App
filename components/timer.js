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

    getEnabled() {
        return this.#enabled
    }

    reset() {
        if (this.#enabled) {
            clearInterval(this.#interval)
            this.#interval = setInterval(this.handler, this.delay)
        }
    }

    destroy() {
        clearInterval(this.#interval)
    }
}

module.exports = Timer