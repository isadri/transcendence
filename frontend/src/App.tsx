import BackGround from './components/background/BackGround'
import { Navigate, RouterProvider} from "react-router-dom";
import './App.css'

import { createContext, useContext, useEffect, useState } from 'react';
import mainRouter from './Routing/mainRouting';
import landingRouter from './Routing/landingrouting';
import axios from 'axios';

interface userDataType {
  id : number,
  username : string,
  email : string,
  avatar : string
}
interface loginContextData {
  isLogged:boolean |null,
  setIsLogged: React.Dispatch<React.SetStateAction<boolean | null>>
  user: userDataType
  setUser : React.Dispatch<React.SetStateAction<object>>
}

const loginContext = createContext<loginContextData |null>(null)

function App() {
  let [isLogged, setIsLogged] = useState<boolean| null>(null);
  let [user, setUser] = useState<userDataType>()
  // console.log(isLogged);
  useEffect(() => {
    axios.get('http://localhost:8000/',  {withCredentials:true})
    .then((response) => {
      setIsLogged(true)
      setUser(response.data)
    })
    .catch(() => {
      setIsLogged(false)
    })
  },[setIsLogged])
  if (isLogged == null)
    return <></>
  return (
    <loginContext.Provider value={{user,setUser, isLogged, setIsLogged}}>
      <BackGround isLogged={isLogged}>
        <RouterProvider router={ isLogged ? mainRouter : landingRouter} />
      </BackGround>
    </loginContext.Provider>
  )
}

export {loginContext}
export type {loginContextData}
export default App;