import * as T from "./PubSub.types"
import {Logger} from 'simple-logger'

export class PubSub {

    // Mapping of event labels to callbacks for that event
    private subscribers : Map<string, T.EventSubscription<any>[]> = new Map()

    // Queue of events to process at next opportunity
    private queue : T.EmittedEvent<any>[] = []

    constructor ( private logger ?: Logger ){}

    // Utils
    private process_backlog () {

        const count = this.queue.length
        const markedForDelete : T.MarkedForDelete[] = []
        const marked : T.EventSubscription<any>[] = []

        for (let i = 0; i < count; i++) {
            
            const event = this.queue[i]
            const callbacks = this.subscribers.get(event.label)
                
            // Trigger each callback and provide a callback to remove the subscription if needed
            if (callbacks) {
                callbacks
                    .filter(sub => !marked.includes(sub))
                    .forEach( callback => {
                        callback(event.data, () => {
                            marked.push(callback)
                            markedForDelete.push({event : event.label, subscription : callback})
                        })
                })
            }
        }

        // Remove all marked subscriptions
        markedForDelete.forEach(({event, subscription}) => {
            const callbacks = this.subscribers.get(event)
            if (!callbacks) return
            const index = callbacks.indexOf(subscription)
            if (!index || index < 0) return
            callbacks.splice(index, 1)
        })

        // Clear the queue of the events that were processed
        this.queue.splice(0, count)
    
    }

    // Public Functions

    public subscribe<EventData> ( label : string, sub : T.EventSubscription<EventData>) {
        const callbacks = this.subscribers.get(label)
        if (!callbacks) this.subscribers.set(label, [sub])
        else callbacks.push(sub)
    }

    public emit<EventData> (label : string, data ?: EventData) {
        this.queue.push({label, data})
    }

    public do_processAll () {
        while (this.queue.length != 0)  
            this.process_backlog()   
    }

}