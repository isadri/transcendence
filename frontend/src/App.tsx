import BackGround from './components/background/BackGround'
import {RouterProvider} from "react-router-dom";
import './App.css'

import {useEffect, useState } from 'react';
import mainRouter from './Routing/mainRouting';
import landingRouter from './Routing/landingrouting';
import axios from 'axios';

import { loginContext } from './context/context';
import { userDataType } from './context/context';
import { getendpoint } from './context/getContextData';

function App() {
  let [isLogged, setIsLogged] = useState<boolean| null>(null)
  let [user, setUser] = useState<userDataType>()
  // const hostname = window.location.hostname
  useEffect(() => {
    axios.get(getendpoint('http', "/"), {withCredentials:true})
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
    <loginContext.Provider value={{  user, setUser, isLogged, setIsLogged}}>
      <BackGround isLogged={isLogged}>
        <RouterProvider router={ isLogged ? mainRouter : landingRouter} />
      </BackGround>
    </loginContext.Provider>
  )
}

export {loginContext}
export default App;