"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSub = void 0;
class PubSub {
    constructor(logger) {
        this.logger = logger;
        // Mapping of event labels to callbacks for that event
        this.subscribers = new Map();
        // Queue of events to process at next opportunity
        this.queue = [];
    }
    // Utils
    process_backlog() {
        const count = this.queue.length;
        const markedForDelete = [];
        const marked = [];
        for (let i = 0; i < count; i++) {
            const event = this.queue[i];
            const callbacks = this.subscribers.get(event.label);
            // Trigger each callback and provide a callback to remove the subscription if needed
            if (callbacks) {
                callbacks
                    .filter(sub => !marked.includes(sub))
                    .forEach(callback => {
                    callback(event.data, () => {
                        marked.push(callback);
                        markedForDelete.push({ event: event.label, subscription: callback });
                    });
                });
            }
        }
        // Remove all marked subscriptions
        markedForDelete.forEach(({ event, subscription }) => {
            const callbacks = this.subscribers.get(event);
            if (!callbacks)
                return;
            const index = callbacks.indexOf(subscription);
            if (!index || index < 0)
                return;
            callbacks.splice(index, 1);
        });
        // Clear the queue of the events that were processed
        this.queue.splice(0, count);
    }
    // Public Functions
    subscribe(label, sub) {
        const callbacks = this.subscribers.get(label);
        if (!callbacks)
            this.subscribers.set(label, [sub]);
        else
            callbacks.push(sub);
    }
    emit(label, data) {
        this.queue.push({ label, data });
    }
    do_processAll() {
        while (this.queue.length != 0)
            this.process_backlog();
    }
}
exports.PubSub = PubSub;
