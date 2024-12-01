
import Header from './comps/header';
import { useState, useEffect, useRef } from 'react';
import store from './state';
import AddNote from './comps/addnote';
import Notes from './comps/notes';

function App() {

  const [darkmode,setDarkMode] = useState(store.get(d=>d.darkMode));

  useEffect(()=>{
    const subscribeId = store.subscribe((s)=>{
      setDarkMode(s.darkMode);
    });
    return ()=>store.unsubscribe(subscribeId);
  });

  return (
    <main className='w-full h-[100vh]' style={{backgroundColor:darkmode?'#434343':'#f1f1f1'}}>
      <Header />
      <AddNote  />
      <Notes />
    </main>
  );

}

export default App
