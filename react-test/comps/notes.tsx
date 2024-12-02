import store from "@src/state";
import { useEffect, useState } from "react";

function Notes(){


    const [notes,setNotes] = useState(store.get().notes || []);
    useEffect(()=>{
        const unsubscribe = store.subscribe((state)=>{
            setNotes(state.notes);
        })
        return ()=>unsubscribe();
    });

    return (<div className="w-full px-4 py-3">
        {notes.map(note=>(<div className="bg-white w-full my-2 border-[1px] border-[#c1c1c1] rounded p-3" key={note.date}>
            <h1 className="text-black mb-3">{note.text}</h1>
            <button 
                onClick={()=>store.getActions().notes.delete(note.date)} 
                className="bg-gray-600 p-2 rounded hover:bg-blue-600"
            >Delete</button>
        </div>))}
    </div>);

}

export  default Notes;