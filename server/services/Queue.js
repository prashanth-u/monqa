class Queue {
    constructor() {
        this.fns = [];
        this.busy = false;
        setInterval(() => this.caller(), 10000);
    }

    async caller() {
        if (this.busy || this.fns.length === 0) {
            return;
        }

        this.busy = true;
        const currentFn = this.fns.shift();
        await currentFn();

        await new Promise(resolve => setTimeout(() => resolve(), 10000));
        this.busy = false;

    }

    addFn(fn) { this.fns.push(fn); }
}

module.exports = Queue;