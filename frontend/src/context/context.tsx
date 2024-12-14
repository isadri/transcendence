import { createContext } from "react";

interface userDataType {
    id : number,
    username : string,
    email : string,
    avatar : string
}
interface loginContextData {
    isLogged:boolean |null,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean | null>>
    user: userDataType | undefined
    setUser: React.Dispatch<React.SetStateAction<userDataType | undefined>>;
    createdAlert: string
    Displayed: number
    setCreatedAlert:  React.Dispatch<React.SetStateAction<string>>
    setDisplayed: React.Dispatch<React.SetStateAction<number>>
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

