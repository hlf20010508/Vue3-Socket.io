import { onBeforeUnmount, getCurrentInstance, ComponentInternalInstance } from "vue";
import VueSocketIO from "./vueSocketIO";
import { ListenerCallback } from "./type";

export default function useSocketIO() {

    /**
     *  Assign runtime callbacks
     */
    const instance: ComponentInternalInstance = getCurrentInstance()!;
    const socketIO: VueSocketIO = instance.appContext.config.globalProperties.$vueSocketIO;

    function subscribe(event: string, callback: ListenerCallback) {
        socketIO.emitter.addListener(event, callback, instance);
    };

    function unsubscribe(event: string) {
        socketIO.emitter.removeListener(event, instance);
    };

    function removeEvent(event: string) {
        socketIO.emitter.removeEvent(event);
    };

    /**
     * unsubscribe when component unmounting
     */
    onBeforeUnmount(() => {
        for (let event of socketIO.emitter.listeners.keys())
            unsubscribe(event);
    });

    return { subscribe, unsubscribe, removeEvent };
}