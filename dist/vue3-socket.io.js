var h = Object.defineProperty;
var u = (i, e, t) => e in i ? h(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var l = (i, e, t) => (u(i, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as g, onBeforeUnmount as a } from "vue";
import d from "socket.io-client";
function w() {
  const i = g(), e = i.appContext.config.globalProperties.$vueSocketIO;
  function t(n, f) {
    e.emitter.addListener(n, f, i);
  }
  function s(n) {
    e.emitter.removeListener(n, i);
  }
  return a(() => {
    for (let n of e.emitter.listeners.keys())
      s(n);
  }), { subscribe: t, unsubscribe: s };
}
const o = new class {
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
class m {
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
      this.listeners.has(e) || this.listeners.set(e, {}), this.listeners.get(e)[s.uid] = t, o.info(`#${e} subscribe, component: ${s.type.__name}`);
    else
      throw new Error("callback must be a function");
  }
  /**
   * remove a listenler
   * @param event
   * @param instance
   */
  removeListener(e, t) {
    this.listeners.has(e) && (t.uid in this.listeners.get(e) && (delete this.listeners.get(e)[t.uid], o.info(`#${e} unsubscribe, component: ${t.type.__name}`)), Object.keys(this.listeners.get(e)).length > 0 && this.listeners.delete(e));
  }
  /**
   * broadcast incoming event to components
   * @param event
   * @param args
   */
  emit(e, t) {
    if (this.listeners.has(e)) {
      o.info(`Broadcasting: #${e}, Data:`, t);
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
    o.debug = t, this.socket = this.connect(e, s), this.emitter = new m(), this.listener = new c(this.socket, this.emitter);
  }
  /**
   * Vue.js entry point
   * @param app
   */
  install(e) {
    e.config.globalProperties.$socket = this.socket, e.config.globalProperties.$vueSocketIO = this, e.provide("socket", this.socket), e.provide("vueSocketIO", this), o.info("Vue-Socket.io plugin enabled");
  }
  /**
   * registering SocketIO instance
   * @param connection
   * @param options
   */
  connect(e, t) {
    if (e && typeof e == "object")
      return o.info("Received socket.io-client instance"), e;
    if (typeof e == "string")
      return o.info("Received connection string"), this.socket = d(e, t);
    throw new Error("Unsupported connection type");
  }
}
export {
  $ as default,
  w as useSocketIO
};
