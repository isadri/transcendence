import { useContext } from "react";
import {loginContext} from './../App'
// import axios from "axios";


export const getContext = () =>{
    return useContext(loginContext)
}

export const getUser = () =>{
    return getContext()?.user
}

export const getendpoint = (path: string) =>{
    return  'http://'+`${window.location.hostname}` + ':8000/' + path
}

// export  const GetUserInfo = () =>{
//     axios.get(getendpoint(''),  {withCredentials:true})
//     .then((response) => {
//       getContext()?.setIsLogged(true)
//       getContext()?.setUser(response.data)
//     })
//     .catch(() => {
//       getContext()?.setIsLogged(false)
//       getContext()?.setUser(undefined)
//     })
//   }