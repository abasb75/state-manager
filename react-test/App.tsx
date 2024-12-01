
import Header from './comps/header';
import { useState, useEffect } from 'react';
import store from './state';

function App() {

  const [darkmode,setDarkMode] = useState(store.get(d=>d.darkMode));

  useEffect(()=>{
    const subscribeId = store.subscribe((s)=>{
      setDarkMode(s.darkMode);
      console.log('subscribe',s);
    });
    return ()=>store.unsubscribe(subscribeId);
  })

  return (
    <main className='w-full h-[100vh]' style={{backgroundColor:darkmode?'#434343':'#f1f1f1'}}>
      <Header />
    </main>
  );

}

export default App
