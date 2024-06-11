var u = Object.defineProperty;
var g = (i, e, t) => e in i ? u(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var s = (i, e, t) => (g(i, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as a, onBeforeUnmount as d } from "vue";
import m, { Socket as k } from "socket.io-client";
function v() {
  const i = a(), e = i.appContext.config.globalProperties.$vueSocketIO;
  function t(n, h) {
    e.emitter.addListener(n, h, i);
  }
  function o(n) {
    e.emitter.removeListener(n, i);
  }
  function f(n) {
    e.emitter.removeEvent(n);
  }
  return d(() => {
    for (let n of e.emitter.listeners.keys())
      o(n);
  }), { subscribe: t, unsubscribe: o, removeEvent: f };
}
const r = new class {
  constructor() {
    s(this, "debug");
    s(this, "prefix");
    this.debug = !1, this.prefix = "%cVue3-Socket.io: ";
  }
  info(e, ...t) {
    this.debug && window.console.info(
      this.prefix + `%c${e}`,
      "color: blue; font-weight: 600",
      "color: #333333",
      ...t
    );
  }
  error(...e) {
    this.debug && window.console.error(this.prefix, ...e);
  }
  warn(...e) {
    this.debug && window.console.warn(this.prefix, ...e);
  }
  event(e, ...t) {
    this.debug && window.console.info(
      this.prefix + `%c${e}`,
      "color: blue; font-weight: 600",
      "color: #333333",
      ...t
    );
  }
}(), c = class c {
  constructor(e, t) {
    s(this, "socket");
    s(this, "emitter");
    this.socket = e, this.register(), this.emitter = t;
  }
  /**
   * Listening all socket.io events
   */
  register() {
    this.socket.onAny((e, ...t) => {
      this.onEvent(e, ...t);
    }), c.staticEvents.forEach((e) => this.socket.on(e, (...t) => this.onEvent(e, ...t)));
  }
  /**
   * Broadcast all events to vuejs environment
   */
  onEvent(e, ...t) {
    this.emitter.emit(e, ...t);
  }
};
/**
 * socket.io-client reserved event keywords
 * @type {string[]}
 */
s(c, "staticEvents", [
  "connect",
  "error",
  "disconnect",
  "reconnect",
  "reconnect_attempt",
  "reconnecting",
  "reconnect_error",
  "reconnect_failed",
  "connect_error",
  "connect_timeout",
  "connecting",
  "ping",
  "pong"
]);
let l = c;
class b {
  constructor() {
    s(this, "listeners");
    this.listeners = /* @__PURE__ */ new Map();
  }
  /**
   * register new event listener with vuejs component instance
   * @param event - the name of the event to listen for
   * @param callback - the function to call when the event occurs
   * @param instance - the Vue.js component instance that is registering the listener
   */
  addListener(e, t, o) {
    if (typeof t == "function")
      this.listeners.has(e) || this.listeners.set(e, {}), this.listeners.get(e)[o.uid] = t, r.info(`#${e} subscribe, component: ${o.type.__name}`);
    else
      throw new Error("callback must be a function");
  }
  /**
   * remove a listener
   * @param event - the name of the event to listen for
   * @param instance - the Vue.js component instance that is registering the listener
   */
  removeListener(e, t) {
    this.listeners.has(e) && (t.uid in this.listeners.get(e) && (delete this.listeners.get(e)[t.uid], r.info(`#${e} unsubscribe, component: ${t.type.__name}`)), Object.keys(this.listeners.get(e)).length == 0 && this.listeners.delete(e));
  }
  /**
   * remove event listener
   * @param event - the name of the event to listen for
   */
  removeEvent(e) {
    this.listeners.has(e) && this.listeners.delete(e);
  }
  /**
   * broadcast incoming event to components
   * @param event - the name of the event to listen for
   * @param args - the arguments to pass to the callback function
   */
  emit(e, ...t) {
    if (this.listeners.has(e)) {
      r.info(`Broadcasting: #${e}, Data:`, t);
      for (let o of Object.keys(this.listeners.get(e)))
        this.listeners.get(e)[o](...t);
    }
  }
}
class y {
  /**
   * lets take all resource
   * @param connection - connection string (https://example.com) or socket.io-client instance
   * @param debug - whether to log all events to console.log
   * @param options - socket.io-client options
   */
  constructor({ connection: e, debug: t = !1, options: o }) {
    s(this, "socket");
    s(this, "emitter");
    s(this, "listener");
    r.debug = t, this.socket = this.connect(e, o), this.emitter = new b(), this.listener = new l(this.socket, this.emitter);
  }
  /**
   * Vue.js entry point
   * @param app - Vue.js app instance
   */
  install(e) {
    e.config.globalProperties.$socket = this.socket, e.config.globalProperties.$vueSocketIO = this, e.provide("socket", this.socket), e.provide("vueSocketIO", this), r.info("Vue-Socket.io plugin enabled");
  }
  /**
   * registering SocketIO instance
   * @param connection - connection string (https://example.com) or socket.io-client instance
   * @param options - socket.io-client options
   */
  connect(e, t) {
    if (e && e instanceof k)
      return r.info("Received socket.io-client instance"), e;
    if (typeof e == "string")
      return r.info("Received connection string"), this.socket = m(e, t);
    throw new Error("Unsupported connection type");
  }
}
export {
  y as default,
  v as useSocketIO
};
