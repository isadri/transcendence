// import { createContext } from "react";

// interface userDataType {
//     id : number,
//     username : string,
//     email : string,
//     avatar : string
//   }
//   interface loginContextData {
//     isLogged:boolean |null,
//     setIsLogged: React.Dispatch<React.SetStateAction<boolean | null>>
//     user: userDataType | undefined
//     setUser: React.Dispatch<React.SetStateAction<userDataType | undefined>>;
//     createdAlert: string
//     Displayed: number
//     setCreatedAlert:  React.Dispatch<React.SetStateAction<string>>
//     setDisplayed: React.Dispatch<React.SetStateAction<number>>
//   }

// // interface loginContextData {
// //     isLogged:boolean | null,
// //     setIsLogged: any
// //     user: userDataType
// //     setUser: any;
// // }


// export const loginContext = createContext<loginContextData | null>(null)

// export type {loginContextData}
// export type {userDataType}

import { createContext } from "react";

interface userDataType {
    id : number,
    username : string,
    email : string,
    avatar : string
    register_complete: boolean,
    from_remote_api: boolean
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

export const loginContext = createContext<loginContextData | null>(null)

export type {loginContextData}
export type {userDataType}