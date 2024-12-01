import createStore from "@lib/createStore";

interface StateType {
    darkMode:boolean;
    
}

const initialState:StateType = {
    darkMode:false,
    
}



const actions = {
    toggleDarkMode:(state:StateType)=>{
        console.log(JSON.stringify(state),state.darkMode,!state.darkMode);
        return {
            ...state,
            darkMode:!state.darkMode,
        };
    },
    theme:{
        setDarkMode:(state:StateType,payload:boolean)=>{
            state.darkMode = payload;
            return state;
        },
    }
}

const store = createStore({
    initialState,
    actions,
});

store.get()

export default store;