import Store from "./Store";
declare class Storage<MSState extends {
    [key: string]: any;
} & keyof MSState extends string ? {} : "Type must be string", MSActions extends {
    [key: string]: any;
} & keyof MSActions extends string ? {} : "Type must be string"> {
    private store;
    private subId;
    constructor(store: Store<MSState, MSActions>);
    destroy(): void;
    mergeWithState(newData: MSState): MSState;
    private set;
    private get;
    private _onStorageUpdate;
    private onStoreStateUpdate;
}
export default Storage;
