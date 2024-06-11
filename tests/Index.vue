<template>
    <div>
        <button id="subscribe-button" @click="handleSubscribeEvent"></button>
        <button id="unsubscribe-button" @click="handleUnsubscribeEvent"></button>
        <button id="remove-event-button" @click="handleRemoveEvent"></button>
        <button id="emit-button" @click="handleEmit"></button>
        <div id="message">{{ message }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { Socket } from 'socket.io-client';
import { useSocketIO } from '../src/index';

const message = ref('');
const socketio = useSocketIO();
const eventName = 'testEvent';
const socket: Socket = inject("socket")!;

function handleSubscribeEvent() {
    socketio.subscribe(eventName, (msg: string) => {
        message.value = msg;
    });
}

function handleUnsubscribeEvent() {
    socketio.unsubscribe(eventName);
    message.value = 'Event unsubscribed.';
}

function handleRemoveEvent() {
    socketio.removeEvent(eventName);
    message.value = 'Event removed.';
}

function handleEmit() {
    socket.emit(eventName, 'Hello from client! Testing emit.')
}
</script>