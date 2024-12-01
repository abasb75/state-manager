
import store from "@src/state";
import { useEffect, useRef } from "react";
import { Enums as SMEnums } from "@lib/index";


export default function Header(){

    console.log('rerender');
    const counterRef = useRef<HTMLHeadingElement>(null);
    useEffect(()=>{
        const subId =   store.subscribe((state)=>{
            if(counterRef.current){
                counterRef.current.innerText  = `${state.counter}`;
            }
        });
        return ()=>{
            store.unsubscribe(subId);
        }
    },[]);

    return (<div className="w-full h-16 bg-white border-b-2 border-[#c0c0c0] flex items-center px-4">
        <button 
            className="p-2 bg-gray-300 rounded-sm text-white hover:bg-blue-400"
            onClick={()=>store.getActions().toggleDarkMode()}
        > toggle darkmode</button>

        <div className="w-full h-full flex items-center justify-end gap-2">
          <button className="text-gray-950 border-2 p-2 rounded-sm"  onClick={()=>store.getActions().counter.increment()}>-</button>
          <h1  className="text-gray-950 " ref={counterRef}>{store.get().counter}</h1>
          <button  className="text-gray-950 border-2 p-2 rounded-sm" onClick={()=>store.getActions().counter.decrement()}>+</button>
        </div>
    </div>);
}