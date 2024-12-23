import { MSExposedMSActions, SMStateSelector, SMStoreOptions, SMStoreState, SMSubscriberCallback } from "./types";
declare class Store<MSState extends {
    [key: string]: any;
} & keyof MSState extends string ? {} : "Type must be string", MSActions extends {
    [key: string]: any;
} & keyof MSActions extends string ? {} : "Type must be string"> {
    private state;
    initialState: SMStoreState<MSState>;
    private storage;
    private subscribers;
    private actions;
    storageKey: string;
    storgable: boolean;
    private _prevJsoned;
    private _newJsoned;
    constructor(storeOptions: SMStoreOptions<MSState, MSActions>);
    destroy(): void;
    get(): MSState;
    get<Selected = unknown>(selector: (state: SMStoreState<MSState>) => Selected): Selected;
    set(newState: Partial<SMStoreState<MSState>>, execSubscribers?: boolean): Promise<MSState>;
    syncSet(newState: Partial<SMStoreState<MSState>>, execSubscribers?: boolean): void;
    private _set;
    addSubscriber(callback: SMSubscriberCallback<MSState>, subscribeTo?: SMStateSelector<MSState>): number;
    subscribe(callback: SMSubscriberCallback<MSState>, subscribeTo?: SMStateSelector<MSState>): () => void;
    private _getUnicIdForSubscriber;
    removeSubscriber(subscribeId: number): void;
    unsubscribe(subscribeId: number): void;
    private execSubscribers;
    getActions(): MSExposedMSActions<MSActions, MSState>;
    private _setupActions;
    private _subSetupActions;
}
export default Store;
