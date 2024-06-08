/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {
    debug: boolean;
    prefix: string;

    constructor() {
        this.debug = false;
        this.prefix = '%cVue3-Socket.io: ';
    }

    info(text: string, ...data: unknown[]) {
        if (this.debug)
            window.console.info(
                this.prefix + `%c${text}`,
                'color: blue; font-weight: 600',
                'color: #333333',
                ...data
            );
    }

    error(...data: unknown[]) {
        if (this.debug) window.console.error(this.prefix, ...data);
    }

    warn(...data: unknown[]) {
        if (this.debug) window.console.warn(this.prefix, ...data);
    }

    event(text: string, ...data: unknown[]) {
        if (this.debug)
            window.console.info(
                this.prefix + `%c${text}`,
                'color: blue; font-weight: 600',
                'color: #333333',
                ...data
            );
    }
}