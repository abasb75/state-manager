export type SMStoreState<MSState> = MSState;
export interface SMStoreOptions<MSState, MSActions> {
    initialState: SMStoreState<MSState>;
    actions: MSStoreActions<MSActions>;
    storageKey?: string;
    storgable?: boolean;
}
export type SMStateSelector<MSState> = (selector: SMStoreState<MSState>) => any;
export type SMSubscriberCallback<T> = (state: T, oldState?: T) => void;
export type SMSubscriber<T> = {
    callback: SMSubscriberCallback<T>;
    id: number;
    subscribeTo: SMStateSelector<T>;
};
export type MSAction<MSState, MSActionPayload = any> = (state: MSState, payloads?: MSActionPayload) => MSState;
export type MSActionWithoutPayload<MSState> = (state: MSState) => MSState;
export type MSStoreActions<MSActions> = MSActions;
export type MSExposedAction<MSState, MSPAction> = MSPAction extends (state: MSState, ...args: infer P) => MSState ? (...args: P) => void : () => void;
export type MSExposedMSActions<MSActions, MSState> = MSActions extends (...args: any[]) => any ? MSActions : {
    [K in keyof MSActions]: [
        MSActions[K],
        MSAction<MSState, any>
    ] extends [MSAction<MSState, any>, MSActions[K]] ? MSExposedAction<MSState, MSActions[K]> : MSExposedMSActions<MSActions[K], MSState>;
};
