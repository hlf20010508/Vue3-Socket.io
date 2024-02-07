var f = Object.defineProperty;
var u = (i, e, t) => e in i ? f(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var h = (i, e, t) => (u(i, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as a, onBeforeUnmount as g } from "vue";
import d from "socket.io-client";
function w() {
  const i = a(), e = i.appContext.config.globalProperties.$vueSocketIO;
  function t(o, l) {
    e.emitter.addListener(o, l, i);
  }
  function s(o) {
    e.emitter.removeListener(o, i);
  }
  return g(() => {
    Object.keys(e.emitter.listeners).forEach((o) => {
      s(o);
    });
  }), { subscribe: t, unsubscribe: s };
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
h(r, "staticEvents", [
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
      this.listeners.has(e) || this.listeners.set(e, []), this.listeners.get(e).push({ callback: t, uid: s.uid }), n.info(`#${e} subscribe, component: ${s.type.__name}`);
    else
      throw new Error("callback must be a function");
  }
  /**
   * remove a listenler
   * @param event
   * @param instance
   */
  removeListener(e, t) {
    if (this.listeners.has(e)) {
      const s = this.listeners.get(e).filter((o) => o.uid !== t.uid);
      s.length > 0 ? this.listeners.set(e, s) : this.listeners.delete(e), n.info(`#${e} unsubscribe, component: ${t.type.__name}`);
    }
  }
  /**
   * broadcast incoming event to components
   * @param event
   * @param args
   */
  emit(e, t) {
    this.listeners.has(e) && (n.info(`Broadcasting: #${e}, Data:`, t), this.listeners.get(e).forEach((s) => {
      s.callback(t);
    }));
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
    n.debug = t, this.socket = this.connect(e, s), this.emitter = new m(), this.listener = new c(this.socket, this.emitter);
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
      return n.info("Received connection string"), this.socket = d(e, t);
    throw new Error("Unsupported connection type");
  }
}
export {
  $ as default,
  w as useSocketIO
};
