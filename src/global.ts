const store: Record<string, string> = {};
const subscriptions: Record<string, ((value: any) => void)[]> = {};

const globalStore = {
    set(key: string, value: string) {
        store[key] = value;
    },
    get(key: string) {
        return store[key];
    },
    subscribe(key: string, callback: (value: any) => void) {
        if (!subscriptions[key]) subscriptions[key] = [];
        subscriptions[key].push(callback);
    },
    unsubscribe(key: string, callback: (value: any) => void) {
        if (!subscriptions[key]) return;
        subscriptions[key] = subscriptions[key].filter(cb => cb !== callback);
    },
    notify(key: string, value: string = '') {
        if (!subscriptions[key]) return;
        subscriptions[key].forEach(cb => cb(value));
    }
}

export default globalStore;