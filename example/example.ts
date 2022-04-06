import {PubSub} from '../src'

const pubsub = new PubSub()

interface ExpectedData  {
    name : string
}

pubsub.subscribe<ExpectedData>('Test', (event, unsubscribe) => {
    if (event.name == 'kill')
        unsubscribe()
    console.log(event.name)
})

pubsub.emit('Test', {name : 'yes'})
pubsub.emit('Test', {name : 'kill'})
pubsub.emit('Test', {name : 'nope'})

pubsub.do_processAll()