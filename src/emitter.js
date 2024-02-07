import Logger from './logger';

export default class EventEmitter {

    constructor() {
        this.listeners = new Map();
    }

    /**
     * register new event listener with vuejs component instance
     * @param event
     * @param callback
     * @param instance
     */
    addListener(event, callback, instance) {
        if (typeof callback === 'function') {
            if (!this.listeners.has(event)) this.listeners.set(event, []);
            this.listeners.get(event).push({ callback, uid: instance.uid });
            Logger.info(`#${event} subscribe, component: ${instance.type.__name}`);
        } else {
            throw new Error(`callback must be a function`);
        }
    }

    /**
     * remove a listenler
     * @param event
     * @param instance
     */
    removeListener(event, instance) {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event).filter(listener => (
                listener.uid !== instance.uid
            ));

            if (listeners.length > 0) {
                this.listeners.set(event, listeners);
            } else {
                this.listeners.delete(event);
            }

            Logger.info(`#${event} unsubscribe, component: ${instance.type.__name}`);
        }
    }

    /**
     * broadcast incoming event to components
     * @param event
     * @param args
     */
    emit(event, args) {
        if (this.listeners.has(event)) {
            Logger.info(`Broadcasting: #${event}, Data:`, args);

            this.listeners.get(event).forEach((listener) => {
                listener.callback(args);
            });
        }
    }
}