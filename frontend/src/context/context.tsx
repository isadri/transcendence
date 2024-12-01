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
  hostname: string
}

export const loginContext = createContext<loginContextData | null>(null)


export type {loginContextData}
export type {userDataType}

