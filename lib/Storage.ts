import Store from "./Store";

class Storage <
    MSState extends { [key: string]: any; } & keyof MSState extends string ? {} : "Type must be string",
    MSActions extends { [key:string]:any; } & keyof MSActions extends string ? {} : "Type must be string",
>{

    private store:Store<MSState,MSActions>;
    private subId:number=-1;

    constructor(store:Store<MSState,MSActions>){
        this.store = store;
        if(!store.storgable){
            return;
        }
        window.addEventListener('storage',this._onStorageUpdate.bind(this));
        this.subId = store.addSubscriber(this.onStoreStateUpdate.bind(this))
        
    }

    destroy() {
        window.removeEventListener('storage',this._onStorageUpdate.bind(this));
        this.store.removeSubscriber(this.subId);
    }

    mergeWithState(newData:MSState):MSState{
        const storageData = this.get();
        this.set({
            ...newData as object,
            ...storageData,
        });
        return this.get();
    }

    private set(data:MSState){
        if(!this.store.storgable || typeof data !== "object"){
            return;
        }
        const prev = this.get();
        const newData = JSON.stringify(data);
        if(prev === newData){
            return;
        }
        window.localStorage.setItem(
            this.store.storageKey,
            newData,
        );
    }

    private get(){
        if(!this.store.storgable){
            return undefined;
        }
        try{
            const parsed =  JSON.parse(
                window.localStorage.getItem(this.store.storageKey) || '{}'
            );
            if(typeof parsed !== "object"){
                return {};
            }
            return parsed;
        }catch{
            return {};
        }
    }

    private _onStorageUpdate(event:StorageEvent){
        const storageKey = event.key;
        if(storageKey !== this.store.storageKey){
            return;
        }
        const { oldValue, newValue } = event;
        if(oldValue === newValue){
            return;
        }
        this.store.set(this.get());
    }

    private onStoreStateUpdate(newData:MSState){
        this.set(newData);
    }
}

export default Storage;