import { SMStoreOptions } from "./types";
import Store from "./Store";

function createStore<
    MSState extends { [key: string]: any; } & keyof MSState extends string ? {} : "Type must be string",
    MSActions extends { [key:string]:any; } & keyof MSActions extends string ? {} : "Type must be string",
>(
    storeOptions:SMStoreOptions<MSState,MSActions>
){
    return new Store(storeOptions);
}


export default createStore;