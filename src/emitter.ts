import { ComponentInternalInstance } from "vue";
import Logger from './logger';
import { ListenerMap, ListenerCallback } from "./type";

export default class EventEmitter {
    listeners: Map<string, ListenerMap>;

    constructor() {
        this.listeners = new Map();
    }

    /**
     * register new event listener with vuejs component instance
     * @param event - the name of the event to listen for
     * @param callback - the function to call when the event occurs
     * @param instance - the Vue.js component instance that is registering the listener
     */
    addListener(event: string, callback: ListenerCallback, instance: ComponentInternalInstance) {
        if (typeof callback === 'function') {
            if (!this.listeners.has(event)) this.listeners.set(event, {});
            this.listeners.get(event)![instance.uid] = callback;
            Logger.info(`#${event} subscribe, component: ${instance.type.__name}`);
        } else {
            throw new Error(`callback must be a function`);
        }
    }

    /**
     * remove a listener
     * @param event - the name of the event to listen for
     * @param instance - the Vue.js component instance that is registering the listener
     */
    removeListener(event: string, instance: ComponentInternalInstance) {
        if (this.listeners.has(event)) {
            if (instance.uid in this.listeners.get(event)!) {
                delete this.listeners.get(event)![instance.uid];
                Logger.info(`#${event} unsubscribe, component: ${instance.type.__name}`);
            }

            if (Object.keys(this.listeners.get(event)!).length == 0)
                this.listeners.delete(event);
        }
    }

    /**
     * remove event listener
     * @param event - the name of the event to listen for
     */
    removeEvent(event: string) {
        if (this.listeners.has(event))
            this.listeners.delete(event);
    }

    /**
     * broadcast incoming event to components
     * @param event - the name of the event to listen for
     * @param args - the arguments to pass to the callback function
     */
    emit(event: string, ...args: any[]) {
        if (this.listeners.has(event)) {
            Logger.info(`Broadcasting: #${event}, Data:`, args);

            for (let uid of Object.keys(this.listeners.get(event)!))
                this.listeners.get(event)![uid](...args);
        }
    }
}