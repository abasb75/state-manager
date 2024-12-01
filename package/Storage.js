class Storage {
    constructor(store) {
        Object.defineProperty(this, "store", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "subId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
        this.store = store;
        if (!store.storgable) {
            return;
        }
        window.addEventListener('storage', this._onStorageUpdate.bind(this));
        this.subId = store.addSubscriber(this.onStoreStateUpdate.bind(this));
    }
    destroy() {
        window.removeEventListener('storage', this._onStorageUpdate.bind(this));
        this.store.removeSubscriber(this.subId);
    }
    mergeWithState(newData) {
        const storageData = this.get();
        this.set(Object.assign(Object.assign({}, newData), storageData));
        return this.get();
    }
    set(data) {
        if (!this.store.storgable || typeof data !== "object") {
            return;
        }
        const prev = this.get();
        const newData = JSON.stringify(data);
        if (prev === newData) {
            return;
        }
        window.localStorage.setItem(this.store.storageKey, newData);
    }
    get() {
        if (!this.store.storgable) {
            return undefined;
        }
        try {
            const parsed = JSON.parse(window.localStorage.getItem(this.store.storageKey) || '{}');
            if (typeof parsed !== "object") {
                return {};
            }
            return parsed;
        }
        catch (_a) {
            return {};
        }
    }
    _onStorageUpdate(event) {
        const storageKey = event.key;
        if (storageKey !== this.store.storageKey) {
            return;
        }
        const { oldValue, newValue } = event;
        if (oldValue === newValue) {
            return;
        }
        this.store.set(this.get());
    }
    onStoreStateUpdate(newData) {
        this.set(newData);
    }
}
export default Storage;
