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

interface stats{
  user: number,
  level: number,
  badge: number,
  win: number,
  lose: number,
  nbr_games: number
}

interface userDataType {
    id : number,
    username : string,
    email : string,
    avatar : string
    register_complete: boolean,
    from_remote_api: boolean,
    is_online: boolean,
    usable_password: boolean,
    stats: stats
}

interface NotificationsData {
    id: number;
    message: string;
    type: string;
    created_at: string;
    is_read: boolean;
  }

interface loginContextData {
    isLogged:boolean |null,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean | null>>
    user: userDataType | null
    setUser: React.Dispatch<React.SetStateAction<userDataType | null>>;
    createdAlert: string
    Displayed: number
    setCreatedAlert:  React.Dispatch<React.SetStateAction<string>>
    setDisplayed: React.Dispatch<React.SetStateAction<number>>

    /******** Notifications **********/
    notifications: NotificationsData[];
    setNotifications: React.Dispatch<React.SetStateAction<NotificationsData[]>>;
    unreadCount: number;
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
 }

export const loginContext = createContext<loginContextData | null>(null)

export type {loginContextData, NotificationsData}
export type {userDataType}