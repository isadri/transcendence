import BackGround from './components/background/BackGround'
import {RouterProvider} from "react-router-dom";
import './App.css'

import {useEffect, useState } from 'react';
import mainRouter from './Routing/mainRouting';
import landingRouter from './Routing/landingrouting';
import axios from 'axios';

import { loginContext } from './context/context';
import { userDataType } from './context/context';

// interface userDataType {
//   id : number,
//   username : string,
//   email : string,
//   avatar : string
// }
// interface loginContextData {
//   isLogged:boolean |null,
//   setIsLogged: React.Dispatch<React.SetStateAction<boolean | null>>
//   hostname: string
//   // user: userDataType | undefined
//   // setUser: React.Dispatch<React.SetStateAction<userDataType | undefined>>;
// }

// const loginContext = createContext<loginContextData | null>(null)

function App() {
  let [isLogged, setIsLogged] = useState<boolean| null>(null)
  let [user, setUser] = useState<userDataType>()
  const hostname = window.location.hostname

  useEffect(() => {
    axios.get('http://'+`${hostname}`+':8000/',  {withCredentials:true})
    .then((response) => {
      setIsLogged(true)
      setUser(response.data)
    })
    .catch(() => {
      setIsLogged(false)
      setUser(undefined)
    })
  },[setIsLogged]) 
  if (isLogged == null)
    return <></>
  return (
    <loginContext.Provider value={{ hostname, user, setUser, isLogged, setIsLogged}}>
      <BackGround isLogged={isLogged}>
        <RouterProvider router={ isLogged ? mainRouter : landingRouter} />
      </BackGround>
    </loginContext.Provider>
  )
}

export {loginContext}
// export type {loginContextData}
export default App;