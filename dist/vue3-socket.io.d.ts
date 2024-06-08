import { App } from 'vue';
import { ComponentInternalInstance } from 'vue';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { ManagerOptions } from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { SocketOptions } from 'socket.io-client';

declare class EventEmitter {
    listeners: Map<string, ListenerMap>;
    constructor();
    /**
     * register new event listener with vuejs component instance
     * @param event - the name of the event to listen for
     * @param callback - the function to call when the event occurs
     * @param instance - the Vue.js component instance that is registering the listener
     */
    addListener(event: string, callback: ListenerCallback, instance: ComponentInternalInstance): void;
    /**
     * remove a listener
     * @param event - the name of the event to listen for
     * @param instance - the Vue.js component instance that is registering the listener
     */
    removeListener(event: string, instance: ComponentInternalInstance): void;
    /**
     * remove event listener
     * @param event - the name of the event to listen for
     */
    removeEvent(event: string): void;
    /**
     * broadcast incoming event to components
     * @param event - the name of the event to listen for
     * @param args - the arguments to pass to the callback function
     */
    emit(event: string, ...args: unknown[]): void;
}

declare type ListenerCallback = (...args: unknown[]) => void;

declare type ListenerMap = {
    [key: string]: ListenerCallback;
};

export declare function useSocketIO(): {
    subscribe: (event: string, callback: ListenerCallback) => void;
    unsubscribe: (event: string) => void;
    removeEvent: (event: string) => void;
};

declare class VueSocketIO {
    socket: Socket;
    emitter: EventEmitter;
    listener: VueSocketIOListener;
    /**
     * lets take all resource
     * @param connection - connection string (https://example.com) or socket.io-client instance
     * @param debug - whether to log all events to console.log
     * @param options - socket.io-client options
     */
    constructor({ connection, debug, options }: VueSocketOptions);
    /**
     * Vue.js entry point
     * @param app - Vue.js app instance
     */
    install(app: App): void;
    /**
     * registering SocketIO instance
     * @param connection - connection string (https://example.com) or socket.io-client instance
     * @param options - socket.io-client options
     */
    connect(connection: string | Socket, options?: ManagerOptions & SocketOptions): Socket<DefaultEventsMap, DefaultEventsMap>;
}
export default VueSocketIO;

declare class VueSocketIOListener {
    /**
     * socket.io-client reserved event keywords
     * @type {string[]}
     */
    static staticEvents: string[];
    socket: Socket;
    emitter: EventEmitter;
    constructor(socket: Socket, emitter: EventEmitter);
    /**
     * Listening all socket.io events
     */
    register(): void;
    /**
     * Broadcast all events to vuejs environment
     */
    onEvent(event: string, ...args: unknown[]): void;
}

declare interface VueSocketOptions {
    connection: string | Socket;
    debug?: boolean;
    options?: ManagerOptions & SocketOptions;
}

export { }
