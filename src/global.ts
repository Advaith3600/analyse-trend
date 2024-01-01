let store: Record<string, string> = {};

const globalStore = {
    set(key: string, value: string) {
        store[key] = value;
    },
    get(key: string) {
        return store[key];
    }
}

export default globalStore;