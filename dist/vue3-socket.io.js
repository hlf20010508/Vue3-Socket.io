var u = Object.defineProperty;
var g = (i, e, t) => e in i ? u(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var l = (i, e, t) => (g(i, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as a, onBeforeUnmount as d } from "vue";
import m from "socket.io-client";
function E() {
  const i = a(), e = i.appContext.config.globalProperties.$vueSocketIO;
  function t(o, f) {
    e.emitter.addListener(o, f, i);
  }
  function s(o) {
    e.emitter.removeListener(o, i);
  }
  function h(o) {
    e.emitter.removeEvent(o);
  }
  return d(() => {
    for (let o of e.emitter.listeners.keys())
      s(o);
  }), { subscribe: t, unsubscribe: s, removeEvent: h };
}
const n = new class {
  constructor() {
    this.debug = !1, this.prefix = "%cVue3-Socket.io: ";
  }
  info(e, t = "") {
    this.debug && window.console.info(
      this.prefix + `%c${e}`,
      "color: blue; font-weight: 600",
      "color: #333333",
      t
    );
  }
  error() {
    this.debug && window.console.error(this.prefix, ...arguments);
  }
  warn() {
    this.debug && window.console.warn(this.prefix, ...arguments);
  }
  event(e, t = "") {
    this.debug && window.console.info(
      this.prefix + `%c${e}`,
      "color: blue; font-weight: 600",
      "color: #333333",
      t
    );
  }
}(), r = class r {
  constructor(e, t) {
    this.socket = e, this.register(), this.emitter = t;
  }
  /**
   * Listening all socket.io events
   */
  register() {
    this.socket.onevent = (e) => {
      let [t, ...s] = e.data;
      s.length === 1 && (s = s[0]), this.onEvent(t, s);
    }, r.staticEvents.forEach((e) => this.socket.on(e, (t) => this.onEvent(e, t)));
  }
  /**
   * Broadcast all events to vuejs environment
   */
  onEvent(e, t) {
    this.emitter.emit(e, t);
  }
};
/**
 * socket.io-client reserved event keywords
 * @type {string[]}
 */
l(r, "staticEvents", [
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
let c = r;
class b {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  /**
   * register new event listener with vuejs component instance
   * @param event
   * @param callback
   * @param instance
   */
  addListener(e, t, s) {
    if (typeof t == "function")
      this.listeners.has(e) || this.listeners.set(e, {}), this.listeners.get(e)[s.uid] = t, n.info(`#${e} subscribe, component: ${s.type.__name}`);
    else
      throw new Error("callback must be a function");
  }
  /**
   * remove a listener
   * @param event
   * @param instance
   */
  removeListener(e, t) {
    this.listeners.has(e) && (t.uid in this.listeners.get(e) && (delete this.listeners.get(e)[t.uid], n.info(`#${e} unsubscribe, component: ${t.type.__name}`)), Object.keys(this.listeners.get(e)).length == 0 && this.listeners.delete(e));
  }
  /**
   * remove event listener
   * @param event
   */
  removeEvent(e) {
    this.listeners.has(e) && this.listeners.delete(e);
  }
  /**
   * broadcast incoming event to components
   * @param event
   * @param args
   */
  emit(e, t) {
    if (this.listeners.has(e)) {
      n.info(`Broadcasting: #${e}, Data:`, t);
      for (let s of Object.keys(this.listeners.get(e)))
        this.listeners.get(e)[s](t);
    }
  }
}
class $ {
  /**
   * lets take all resource
   * @param connection
   * @param debug
   * @param options
   */
  constructor({ connection: e, debug: t, options: s }) {
    n.debug = t, this.socket = this.connect(e, s), this.emitter = new b(), this.listener = new c(this.socket, this.emitter);
  }
  /**
   * Vue.js entry point
   * @param app
   */
  install(e) {
    e.config.globalProperties.$socket = this.socket, e.config.globalProperties.$vueSocketIO = this, e.provide("socket", this.socket), e.provide("vueSocketIO", this), n.info("Vue-Socket.io plugin enabled");
  }
  /**
   * registering SocketIO instance
   * @param connection
   * @param options
   */
  connect(e, t) {
    if (e && typeof e == "object")
      return n.info("Received socket.io-client instance"), e;
    if (typeof e == "string")
      return n.info("Received connection string"), this.socket = m(e, t);
    throw new Error("Unsupported connection type");
  }
}
export {
  $ as default,
  E as useSocketIO
};
