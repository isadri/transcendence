import BackGround from './components/background/BackGround'
import { Navigate, RouterProvider} from "react-router-dom";
import './App.css'

import { createContext, useContext, useEffect, useState } from 'react';
import mainRouter from './Routing/mainRouting';
import landingRouter from './Routing/landingrouting';
import axios from 'axios';

interface loginContextData {
  isLogged:boolean |null,
  setIsLogged: React.Dispatch<React.SetStateAction<boolean | null>>
}

const loginContext = createContext<loginContextData |null>(null)

function App() {
  let [isLogged, setIsLogged] = useState<boolean| null>(null);
  // console.log(isLogged);
  useEffect(() => {
    axios.get('http://localhost:8000/',  {withCredentials:true})
    .then(() => {
      setIsLogged(true)
    })
    .catch(() => {
      setIsLogged(false)
    })
  },[setIsLogged])
  if (isLogged == null)
    return <></>
  return (
    <loginContext.Provider value={{isLogged, setIsLogged}}>
      <BackGround isLogged={isLogged}>
        <RouterProvider router={ isLogged ? mainRouter : landingRouter} />
      </BackGround>
    </loginContext.Provider>
  )
}

export {loginContext}
export default App;