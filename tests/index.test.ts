import { beforeEach, describe, it, expect, afterEach } from "vitest";
import { VueWrapper, mount } from '@vue/test-utils';
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import Index from './Index.vue';
import Vue3SocketIO from '../src/index';

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}

function sleep(milisec = 100) {
    return new Promise(resolve => setTimeout(resolve, milisec));
}

describe("Index", () => {
    let io: Server;
    let serverSocket: ServerSocket;
    let clientSocket: ClientSocket;
    let vueSocketIO: Vue3SocketIO;
    let wrapper: VueWrapper;

    const options = { path: "/my-app/" };
    const eventName = 'testEvent';

    beforeEach(() => {
        return new Promise((resolve) => {
            const httpServer = createServer();
            io = new Server(httpServer, options);
            httpServer.listen(() => {
                const port = (httpServer.address() as AddressInfo).port;
                clientSocket = ioc(`http://localhost:${port}`, options);
                io.on("connection", (socket) => {
                    serverSocket = socket;
                });
                clientSocket.on("connect", resolve);

                vueSocketIO = new Vue3SocketIO({
                    debug: true,
                    connection: clientSocket,
                });

                wrapper = mount(Index, {
                    global: {
                        plugins: [vueSocketIO]
                    }
                });
            });
        });
    });

    afterEach(() => {
        io.close();
        clientSocket.disconnect();
    });

    it("should subscribe an event", async () => {
        const eventContent = 'Hello from server! Testing subscribe.'
        await wrapper.find('#subscribe-button').trigger('click');

        await sleep();

        serverSocket.emit(eventName, eventContent);
        await waitFor(clientSocket, eventName);

        expect(wrapper.find('#message').text()).toContain(eventContent);
        expect(vueSocketIO.listener.emitter.listeners.has(eventName)).toBe(true);
    });

    it("should unsubscribe an event", async () => {
        const eventContent = 'Hello from server! Testing unsubscribe.'
        await wrapper.find('#subscribe-button').trigger('click');

        await sleep();

        serverSocket.emit(eventName, eventContent);
        await waitFor(clientSocket, eventName);

        await wrapper.find('#unsubscribe-button').trigger('click');

        expect(wrapper.find('#message').text()).toContain('Event unsubscribed.');
        expect(vueSocketIO.listener.emitter.listeners.has(eventName)).toBe(false);
    });

    it("should remove an event", async () => {
        const eventContent = 'Hello from server! Testing remove event.'
        await wrapper.find('#subscribe-button').trigger('click');

        await sleep();

        serverSocket.emit(eventName, eventContent);
        await waitFor(clientSocket, eventName);

        await wrapper.find('#remove-event-button').trigger('click');

        expect(wrapper.find('#message').text()).toContain('Event removed.');
        expect(vueSocketIO.listener.emitter.listeners.has(eventName)).toBe(false);
    });

    it("should emit a socket event when button is clicked", async () => {
        let receivedPayload = '';
        serverSocket.on(eventName, (payload: string) => {
            receivedPayload = payload;
        });

        await wrapper.find('#emit-button').trigger('click');
        await sleep();

        expect(receivedPayload).toBe('Hello from client! Testing emit.');
    });
});
