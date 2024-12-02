import { createContext } from "react";

interface userDataType {
    id : number,
    username : string,
    email : string,
    avatar : string
}

interface loginContextData {
    isLogged:boolean | null,
    setIsLogged: any
    user: userDataType
    setUser: any;
}


const emptyContext = {
    isLogged:null,
    setIsLogged: undefined,
    user: {
        id : -1,
        username : "",
        email : "",
        avatar : ""
    },
    setUser: undefined
}


export const loginContext = createContext<loginContextData>(emptyContext)

export type {loginContextData}
export type {userDataType}

