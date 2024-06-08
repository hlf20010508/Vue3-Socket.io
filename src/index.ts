import socket, { Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import { App } from "vue";
import useSocketIO from './socketIO';
import Logger from './logger';
import Listener from './listener';
import Emitter from './emitter';
import { VueSocketOptions } from './type';

export { useSocketIO };

export default class VueSocketIO {
    socket: Socket;
    emitter: Emitter;
    listener: Listener;

    /**
     * lets take all resource
     * @param connection - connection string (https://example.com) or socket.io-client instance
     * @param debug - whether to log all events to console.log
     * @param options - socket.io-client options
     */
    constructor({ connection, debug = false, options }: VueSocketOptions) {
        Logger.debug = debug;
        this.socket = this.connect(connection, options);
        this.emitter = new Emitter();
        this.listener = new Listener(this.socket, this.emitter);
    }

    /**
     * Vue.js entry point
     * @param app - Vue.js app instance
     */
    install(app: App) {
        app.config.globalProperties.$socket = this.socket;
        app.config.globalProperties.$vueSocketIO = this;

        app.provide('socket', this.socket);
        app.provide('vueSocketIO', this);

        Logger.info('Vue-Socket.io plugin enabled');
    }

    /**
     * registering SocketIO instance
     * @param connection - connection string (https://example.com) or socket.io-client instance
     * @param options - socket.io-client options
     */
    connect(connection: string | Socket, options?: ManagerOptions & SocketOptions) {
        if (connection && connection instanceof Socket) {
            Logger.info('Received socket.io-client instance');

            return connection;
        } else if (typeof connection === 'string') {
            Logger.info('Received connection string');

            return this.socket = socket(connection, options);
        } else {
            throw new Error('Unsupported connection type');
        }
    }
}
