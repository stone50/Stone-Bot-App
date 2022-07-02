class Timer {
    #enabled;
    #interval;

    constructor(handler, delay, enabled = true) {
        this.handler = handler;
        this.delay = delay;
        this.#enabled = enabled;
        if (this.#enabled) {
            this.#interval = setInterval(this.handler, this.delay);
        }
    }

    setEnabled(enabled) {
        this.#enabled = enabled;
        clearInterval(this.#interval);
        if (this.#enabled) {
            this.#interval = setInterval(this.handler, this.delay);
        }
    }

    reset() {
        if (this.#enabled) {
            clearInterval(this.#interval);
            this.#interval = setInterval(this.handler, this.delay);
        }
    }
};

exports.Timer = Timer;