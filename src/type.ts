import { ComponentInternalInstance } from "vue";
import { Socket, ManagerOptions, SocketOptions } from "socket.io-client";

export type ListenerCallback = (...args: any[]) => void;
export type ListenerMap = { [key: string]: ListenerCallback };

export interface SocketIOInstance {
    emitter: {
        addListener: (event: string, callback: Function, instance: ComponentInternalInstance) => void;
        removeListener: (event: string, instance: ComponentInternalInstance) => void;
        removeEvent: (event: string) => void;
        listeners: Map<string, ListenerMap>;
    };
}

export interface VueSocketOptions {
    connection: string | Socket;
    debug?: boolean;
    options?: Partial<ManagerOptions & SocketOptions>;
}
