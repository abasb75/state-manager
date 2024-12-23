import Storage from "./Storage";
import Utitlities from "./Utitlities";
class Store {
    constructor(storeOptions) {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "initialState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "storage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "subscribers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "actions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "storageKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "sm-state"
        });
        Object.defineProperty(this, "storgable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_prevJsoned", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "_newJsoned", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        const initialState = Utitlities.sortObject(storeOptions.initialState);
        this.storageKey = storeOptions.storageKey || 'sm-state';
        this.storgable = storeOptions.storgable || false;
        this.initialState = initialState;
        this.storage = new Storage(this);
        if (this.storgable) {
            this.state = this.storage.mergeWithState(initialState);
        }
        else {
            this.state = initialState;
        }
        this.actions = this._setupActions(storeOptions.actions);
    }
    destroy() {
        this.storage.destroy();
    }
    get(selector = s => s) {
        return selector(this.state);
    }
    set(newState, execSubscribers = true) {
        return new Promise((resolve, reject) => {
            try {
                this.syncSet(newState, execSubscribers);
                resolve(this.state);
            }
            catch (_a) {
                reject();
            }
        });
    }
    syncSet(newState, execSubscribers = true) {
        const tempState = this._set(Utitlities.cloneObject(this.state), newState);
        this._prevJsoned = JSON.stringify(this.state);
        this._newJsoned = JSON.stringify(tempState);
        if (this._prevJsoned === this._newJsoned) {
            return;
        }
        if (execSubscribers) {
            this.execSubscribers(Object.assign({}, tempState));
        }
        this.state = tempState;
    }
    _set(prevValue, newValue) {
        if (typeof prevValue === "object"
            && typeof newValue === "object"
            && !Array.isArray(prevValue)
            && !Array.isArray(newValue)) {
            Object.keys(Object.assign(Object.assign({}, prevValue), newValue)).forEach((key) => {
                prevValue[key] = this._set(prevValue[key], newValue[key]);
            });
            return Utitlities.sortObject(prevValue);
        }
        return newValue;
    }
    addSubscriber(callback, subscribeTo = (s) => s) {
        const id = this._getUnicIdForSubscriber();
        this.subscribers.push({
            id,
            callback: callback,
            subscribeTo: subscribeTo,
        });
        return id;
    }
    subscribe(callback, subscribeTo = (s) => s) {
        const id = this.addSubscriber(callback, subscribeTo);
        return (() => this.unsubscribe(id)).bind(this);
    }
    _getUnicIdForSubscriber() {
        return this.subscribers.length ? this.subscribers[this.subscribers.length - 1].id + 1 : 0;
    }
    removeSubscriber(subscribeId) {
        this.subscribers = this.subscribers.filter(s => s.id !== subscribeId);
    }
    unsubscribe(subscribeId) {
        this.removeSubscriber(subscribeId);
    }
    execSubscribers(newData) {
        this.subscribers.forEach(subscriber => {
            try {
                const oldValue = subscriber.subscribeTo(this.state);
                const newValue = subscriber.subscribeTo(newData);
                // subscriber.callback(Utitlities.cloneObject(newValue),Utitlities.cloneObject(oldValue));
                subscriber.callback(Object.assign({}, newValue), Object.assign({}, oldValue));
            }
            catch (_a) {
                return;
            }
        });
    }
    getActions() {
        return this.actions;
    }
    _setupActions(actions) {
        return this._subSetupActions(actions);
    }
    _subSetupActions(actions) {
        if (typeof actions === "function") {
            return ((payloads) => {
                this.set(actions(Object.assign({}, this.state), payloads));
            });
        }
        if (typeof actions !== "object") {
            return;
        }
        const actionstemp = {};
        Object.keys(actions).forEach(key => {
            actionstemp[key] = this._subSetupActions(actions[key]);
        });
        return actionstemp;
        ;
    }
}
export default Store;
