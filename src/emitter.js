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
            if (!this.listeners.has(event)) this.listeners.set(event, {});
            this.listeners.get(event)[instance.uid] = callback;
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
            if (instance.uid in this.listeners.get(event)) {
                delete this.listeners.get(event)[instance.uid];
                Logger.info(`#${event} unsubscribe, component: ${instance.type.__name}`);
            }

            if (Object.keys(this.listeners.get(event)).length > 0)
                this.listeners.delete(event);
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

            for(let uid of Object.keys(this.listeners.get(event)))
                this.listeners.get(event)[uid](args);
        }
    }
}