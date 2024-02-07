import useSocketIO from './socketIO';
import Logger from './logger';
import Listener from './listener';
import Emitter from './emitter';
import socket from 'socket.io-client';

export { useSocketIO };

export default class VueSocketIO {

    /**
     * lets take all resource
     * @param connection
     * @param debug
     * @param options
     */
    constructor({ connection, debug, options }) {
        Logger.debug = debug;
        this.socket = this.connect(connection, options);
        this.emitter = new Emitter();
        this.listener = new Listener(this.socket, this.emitter);
    }

    /**
     * Vue.js entry point
     * @param app
     */
    install(app) {
        app.config.globalProperties.$socket = this.socket;
        app.config.globalProperties.$vueSocketIO = this;

        app.provide('socket', this.socket);
        app.provide('vueSocketIO', this);

        Logger.info('Vue-Socket.io plugin enabled');
    }

    /**
     * registering SocketIO instance
     * @param connection
     * @param options
     */
    connect(connection, options) {
        if (connection && typeof connection === 'object') {
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
