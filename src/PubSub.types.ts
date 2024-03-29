export interface EmittedEvent<Data> { 
    label : string
    data : Data
}
export interface MarkedForDelete {
    event : string
    subscription : EventSubscription<any>
}

export type RemoveSubscription = () => void
export type EventSubscription<T> = (data : T, remove ?: RemoveSubscription ) => void