## Simple PubSub

Lots of other pub-sub systems are global for the project which I dont like.
This is a simple implementation that is instance-basted

## Example

```js

import {PubSub} from 'simple-pubsub'

// Instance based
const pubsub = new PubSub()

interface ExpectedData  {
    name : string
}

// Unsubscribe callback added to subscription
pubsub.subscribe<ExpectedData>('Test', (event, unsubscribe) => {
    if (event.name == 'kill')
        unsubscribe()
    console.log(event.name)
})

// Queue up three events in this order
pubsub.emit('Test', {name : 'yes'})
pubsub.emit('Test', {name : 'kill'})
pubsub.emit('Test', {name : 'nope'})

// Events are ONLY processed when you request they are
pubsub.do_processAll()
```