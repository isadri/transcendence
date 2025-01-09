import { useContext } from "react";
import { loginContext } from "./../App";

export const getContext = () => {
	return useContext(loginContext);
};

export const getUser = () => {
	return getContext()?.user;
};

export const getNotifications = () => {
	return getContext()?.notifications;
};

export const getUnreadCount = () => {
	return getContext()?.unreadCount;
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
	return pro + "s://" + window.location.hostname + path;
};

