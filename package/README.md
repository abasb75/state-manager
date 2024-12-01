# @abasb75/state-manager
`@abasb75/state-manager` is a great and best state manager tools for your javascript web applications.  
1. synct data between opened browser tabs.
2. save data on `localstorage`
3. great type hint for `state` or defined `action`
4. 

# installation

```sh
npm i @abasb75/state-manager --save
```

# Quick Start:

1. Create `initial value`  for passing to store's object:

```javascript

interface StateType {
    darkMode:boolean;
    counter:number;
    notes:{
        text:string;
        date:number;
    }[];
}

const initialState:StateType = {
    darkMode:false,
    counter:0,
    notes:[],
}

```


2. Define your `actions`:

```javascript

const actions = {
    toggleDarkMode:(state:StateType)=>{
        return {
            ...state,
            darkMode:!state.darkMode,
        };
    },
    counter:{
        increment:(state:StateType)=>{
            return {
                ...state,
                counter:state.counter+1,
            }
        },
        decrement:(state:StateType)=>{
            return {
                ...state,
                counter:state.counter-1,
            }
        },
    },
    notes:{
        add:(state:StateType,text:string):StateType=>{
            console.log('add worked!')
            return {
                ...state,
                notes:[
                    ...state.notes,
                    {
                        text:text,
                        date:Date.now(),
                    }
                ]
            }
        },
        delete:(state:StateType,id:number):StateType=>{
            return {
                ...state,
                notes:state.notes.filter(n=>n.date!==id),
            }
        },
    }
}

```

3. Create your store:

```javascript

import { createStore } from "@abasb75/state-manager";

...

const initialState:StateType = {
    ...
}


const actions = {
    ...
}

const store = createStore({
    initialState,
    actions,
    storgable:true, // if storagble sets true, states saved on localstorage
    storageKey:'mystorage',
});

export default store;

```

4. import store everywhere you neeed it:

```javascript

import store from './store';

```

5. get state data with `get` method:

```javascript

const state = store.get(); //return state

...

const state = store.get(state=>state.counter); //return counter value 

```

6. update state properties value with `set` method:

```javascript

store.set({
  counter:0;
}).then(state=>{
  console.log(state.counter);
});

```

7. update state value with defiened `actions`:

```javascript
store.getActions().counter.increment();

```

# Examples:
<a href="https://github.com/abasb75/state-manager/tree/main/react-test">Simple Note App</a>