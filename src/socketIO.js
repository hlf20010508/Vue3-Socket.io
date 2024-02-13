import { onBeforeUnmount, getCurrentInstance } from "vue";

export default function () {

    /**
     *  Assign runtime callbacks
     */
    const instance = getCurrentInstance();
    const socketIO = instance.appContext.config.globalProperties.$vueSocketIO;

    function subscribe(event, callback) {
        socketIO.emitter.addListener(event, callback, instance);
    };

    function unsubscribe(event) {
        socketIO.emitter.removeListener(event, instance);
    };

    /**
     * unsubscribe when component unmounting
     */
    onBeforeUnmount(() => {
        for (let event of socketIO.emitter.listeners.keys())
            unsubscribe(event);
    })

    return { subscribe, unsubscribe };
}