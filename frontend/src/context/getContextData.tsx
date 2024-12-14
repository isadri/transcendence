import { useContext } from "react";
import { loginContext } from "./../App";
import { context } from "@react-three/fiber";
// import axios from "axios";

export const getContext = () => {
	return useContext(loginContext);
};

export const getUser = () => {
	return getContext()?.user;
};

export const setUser = (username: string, email: string,
	avatar: string) => {
	const user = getUser();
	if (user) {
		user.username = username;
		user.email = email;
		user.avatar = avatar;
	}
};

// export const setCreatedAlertDel = (createdAlert: string, Displayed: number) =>{
// 	const account = getContext()
// 	if (account){
// 		account.createdAlert = createdAlert;
// 		account.Displayed = Displayed
// 	}
// } 

export const getendpoint = (pro: string, path: string) => {
	return pro + "://" + `${window.location.hostname}` + ":8000" + path;
};

// export const getwebsocket = (path: string) => {
// 	return "ws://" + `${window.location.hostname}` + ":8000/" + path;
// };

// export  const GetUserInfo = () =>{
//     axios.get(getendpoint("http", '/'),  {withCredentials:true})
//     .then((response) => {
//       getContext()?.setIsLogged(true)
//       getContext()?.setUser(response.data)
//     })
//     .catch(() => {
//       getContext()?.setIsLogged(false)
//       getContext()?.setUser(undefined)
//     })
//   }
