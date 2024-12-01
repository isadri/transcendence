import { useContext } from "react";
import {loginContext} from './../App'
// import axios from "axios";


export const getContext = () =>{
    return useContext(loginContext)
}

export const getUser = () =>{
    return getContext()?.user
}

export const getendpoint = (pro : string , path: string) =>{
    return  pro + '://'+`${window.location.hostname}` + ':8000' + path
}

// export  const GetUserInfo = () =>{
//     axios.get(getendpoint('http', '/'),  {withCredentials:true})
//     .then((response) => {
//       getContext()?.setIsLogged(true)
//       getContext()?.setUser(response.data)
//     })
//     .catch(() => {
//       getContext()?.setIsLogged(false)
//       getContext()?.setUser(undefined)
//     })
//   }