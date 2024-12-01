
import store from "@src/state";


export default function Header(){
    return (<div className="w-full h-16 bg-white border-b-2 border-[#c0c0c0] flex items-center px-4">
        <button 
            className="p-2 bg-gray-300 rounded-sm text-white hover:bg-blue-400"
            onClick={()=>store.getActions().toggleDarkMode()}
        > toggle darkmode</button>
    </div>);
}