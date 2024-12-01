import {
    MSExposedMSActions,
    SMStateSelector, 
    SMStoreOptions, 
    SMStoreState, 
    SMSubscriber,
    SMSubscriberCallback,
} from "./types";
import Storage from "./Storage";
import Utitlities from "./Utitlities";

class Store<
    MSState extends { [key:string]:any } & keyof MSState extends string ? {}: "Type must be string",
    MSActions extends { [key:string]:any; } & keyof MSActions extends string ? {} : "Type must be string",
>{
    private state:SMStoreState<MSState>;
    initialState:SMStoreState<MSState>;
    private storage:Storage<MSState,MSActions>;
    private subscribers:SMSubscriber<any>[] = [];
    private actions:MSExposedMSActions<MSActions,MSState>;

    storageKey:string = "sm-state";
    storgable:boolean=false;

    constructor(storeOptions:SMStoreOptions<MSState,MSActions>){

        const initialState = Utitlities.sortObject(storeOptions.initialState as object) as MSState;

        this.storageKey = storeOptions.storageKey || 'sm-state';
        this.storgable = storeOptions.storgable || false;

        this.initialState = initialState ;
        this.storage = new Storage<MSState,MSActions>(this);

        this.state = this.storage.mergeWithState(initialState );
        this.actions = this._setupActions(storeOptions.actions);

    }

    destroy(){
        this.storage.destroy();
    }

    get():MSState;
    get<Selected=unknown>(selector:(state:SMStoreState<MSState>)=>Selected):Selected;
    get(selector:SMStateSelector<MSState>=s=>s){
        return selector(this.state); 
    }

    set(newState:Partial<SMStoreState<MSState>>,execSubscribers:boolean=true){
        return new Promise<MSState>((resolve,reject)=>{
            try{
                this.syncSet(newState,execSubscribers);
                resolve(this.state);
            }catch{
                reject();
            }
        });
    }

    syncSet(newState:Partial<SMStoreState<MSState>>,execSubscribers:boolean=true){
        const tempState = this._set(Utitlities.cloneObject(this.state),newState);
        if(JSON.stringify(tempState) === JSON.stringify(this.state)){
            return;
        }
        
        if(execSubscribers){
            this.execSubscribers({ ...tempState });
        }
        this.state = { ...tempState as object} as MSState;
        
    }

    private _set(prevValue:any,newValue:any){
        if(
            typeof prevValue === "object" 
            && typeof newValue === "object"
            && !Array.isArray(prevValue)
            && !Array.isArray(newValue)
        ){
            Object.keys(prevValue).forEach((key:string)=>{
                prevValue[key] = this._set(prevValue[key],newValue[key]);
            });
            return Utitlities.sortObject(prevValue);
        }
        return newValue;
    }

    addSubscriber(
        callback:SMSubscriberCallback<MSState>,
        subscribeTo:SMStateSelector<MSState>=(s)=>s
    ){
        const id = this._getUnicIdForSubscriber();
        this.subscribers.push({
            id,
            callback:callback as SMSubscriberCallback<MSState>,
            subscribeTo:subscribeTo,
        });
        return id;
    }

    subscribe(
        callback:SMSubscriberCallback<MSState>,
        subscribeTo:SMStateSelector<MSState>=(s)=>s
    ){
        return this.addSubscriber(callback,subscribeTo);
    }
    
    private _getUnicIdForSubscriber(){
        return this.subscribers.length ? this.subscribers[this.subscribers.length-1].id+1 : 0;
    }

    removeSubscriber(subscribeId:number){
        this.subscribers = this.subscribers.filter(s=>s.id!==subscribeId);
    }

    unsubscribe(subscribeId:number){
        this.removeSubscriber(subscribeId);
    }

    private execSubscribers(newData:MSState){
        this.subscribers.forEach(subscriber=>{
            try{
                const oldValue = subscriber.subscribeTo(this.state);
                const newValue = subscriber.subscribeTo(newData);
                if(JSON.stringify(newValue) === JSON.stringify(oldValue)){
                    return;
                }
                subscriber.callback(Utitlities.cloneObject(newValue),Utitlities.cloneObject(oldValue));
            }catch{
                return;
            }
        });   
    }

    getActions(){
        return this.actions;
    }

    private _setupActions(actions:MSActions){
        return this._subSetupActions(actions) as MSExposedMSActions<MSActions,MSState>;
    }

    private _subSetupActions(actions:any){
        if(typeof actions === "function"){
            return ((payloads?:any)=>{
                this.set(actions(Utitlities.cloneObject(this.state),payloads));
            });
        }
        if(typeof actions !== "object"){
            return;
        }
        const actionstemp:Record<string,any> = {};
        Object.keys(actions).forEach(key=>{
            actionstemp[key] =  this._subSetupActions(actions[key]);
        });
        return actionstemp as MSExposedMSActions<MSActions,MSState>;;
    }

}

export default Store;