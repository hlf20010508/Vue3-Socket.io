import { Socket } from 'socket.io-client';
import EventEmitter from './emitter';

export default class VueSocketIOListener {

    /**
     * socket.io-client reserved event keywords
     * @type {string[]}
     */
    static staticEvents: string[] = [
        'connect',
        'error',
        'disconnect',
        'reconnect',
        'reconnect_attempt',
        'reconnecting',
        'reconnect_error',
        'reconnect_failed',
        'connect_error',
        'connect_timeout',
        'connecting',
        'ping',
        'pong'
    ];

    socket: Socket;
    emitter: EventEmitter;

    constructor(socket: Socket, emitter: EventEmitter) {
        this.socket = socket;
        this.register();
        this.emitter = emitter;
    }

    /**
     * Listening all socket.io events
     */
    register() {
        this.socket.onAny((event: string, ...args: any[]) => {
            this.onEvent(event, ...args);
        });

        VueSocketIOListener.staticEvents.forEach(event => this.socket.on(event, (...args: any[]) => this.onEvent(event, ...args)))
    }

    /**
     * Broadcast all events to vuejs environment
     */
    onEvent(event: string, ...args: any[]) {
        this.emitter.emit(event, ...args);
    }

}
