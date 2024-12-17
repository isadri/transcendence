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

const emptyUser = {
  id : -1,
  username : "",
  email : "",
  avatar : ""
}

function App() {
  let [isLogged, setIsLogged] = useState<boolean| null>(null)
  let [user, setUser] = useState<userDataType | undefined>(emptyUser)
  // const hostname = window.location.hostname
  let [createdAlert, setCreatedAlert] = useState('')
  let [Displayed, setDisplayed] = useState(1)
  useEffect(() => {
    axios.get(getendpoint('http', "/"), {withCredentials:true})
    .then((response:any) => {
      setIsLogged(true)
      setUser(response.data)
    })
    .catch(() => {
      setIsLogged(false)
      setUser(emptyUser)
    })
  },[setIsLogged]) 
  if (isLogged == null)
    return <></>
  return (
    <loginContext.Provider value={{user, setUser, isLogged, setIsLogged,
    createdAlert, setCreatedAlert, Displayed, setDisplayed}}>
      <BackGround isLogged={isLogged}>
        <RouterProvider router={ isLogged ? mainRouter : landingRouter} />
      </BackGround>
    </loginContext.Provider>
  )
}

export {loginContext}
export default App;