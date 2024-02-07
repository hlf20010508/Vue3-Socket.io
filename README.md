<p align="center">
    <a href="https://github.com/hlf20010508/Vue3-Socket.io">
        <img width="250" src="https://github.com/hlf20010508/Vue3-Socket.io/assets/76218469/d912dc31-c130-462e-9740-88420449c82d">
    </a>
</p> 

## Description
- Socket.io implementation for Vue.js 3.0.
- Based on [MetinSeylan/Vue-Socket.io](https://github.com/MetinSeylan/Vue-Socket.io).
- **Only Support Vue3.**

## Installation
```bash
npm install @hlf01/vue3-socket.io
```

## Example
### Register
#### Using Connection String
```js
import { createApp } from 'vue'
import App from '@/App.vue'
import Vue3SocketIO from '@hlf01/vue3-socket.io';

const vue3SocketIO = new Vue3SocketIO({
    debug: true,
    connection: 'https://example.com',
    options: { path: "/my-app/" } //Optional options
});

const app = createApp(App)

app.use(vue3SocketIO)

app.mount('#app')
```

#### Using socket.io-client Instance
```js
import { createApp } from 'vue'
import App from '@/App.vue'
import SocketIO from 'socket.io-client';
import Vue3SocketIO from '@hlf01/vue3-socket.io';

const options = { path: "/my-app/" };
const vue3SocketIO = new Vue3SocketIO({
    debug: true,
    connection: SocketIO('https://example.com', options),
});

const app = createApp(App)

app.use(vue3SocketIO)

app.mount('#app')
```

### Usage
```js
<script setup>
import { onMounted, inject } from "vue";
import { useSocketIO } from "@hlf01/vue3-socket.io";

const socketIO = useSocketIO();
const socket = inject("socket");

onMounted(() => {
    socketIO.subscribe("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    // Custom event name
    socketIO.subscribe("getMessages", (messages) => {
        console.log("Received messages:", messages);
    });
});

// All event listeners will be unsubscribed automatically once the component is unmounted

function unsubscribeEvent(eventName) {
    // Unsubscribe event
    socketIO.unsubscribe(eventName);
}

function sendMessage(message) {
    // Emit event
    socket.emit("sendMessage", message);
}
</script>
```

## Parameters
**Parameters**|**Type's**|**Default**|**Required**|**Description**
-----|-----|-----|-----|-----
debug|Boolean|`false`|Optional|Enable logging for debug
connection|String/Socket.io-client|`null`|Required|Websocket server url or socket.io-client instance