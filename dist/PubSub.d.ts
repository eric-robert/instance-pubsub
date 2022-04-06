import * as T from "./PubSub.types";
import { Logger } from 'simple-logger';
export declare class PubSub {
    private logger?;
    private subscribers;
    private queue;
    constructor(logger?: Logger);
    private process_backlog;
    subscribe<EventData>(label: string, sub: T.EventSubscription<EventData>): void;
    emit<EventData>(label: string, data?: EventData): void;
    do_processAll(): void;
}
