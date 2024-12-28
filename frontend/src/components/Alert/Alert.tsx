import React, { useEffect } from "react";
import { getContext } from "../../context/getContextData";
import "./Alert.css";

interface Props {
	primaryColor: string;
	secondaryColor: string;
	children: React.ReactNode;
}
function Alert({ primaryColor, secondaryColor, children }: Props) {
	const account = getContext();

	let primaryColorr = ''
	let icon:React.ReactNode = ''
	if (account?.Displayed === 3)
	{
		icon = <i className="fa-solid fa-circle-exclamation"></i>
		primaryColorr = '#ff00005a' //red
	}
	else if(account?.Displayed === 4)
	{
		icon = <i className="fa-solid fa-info-circle alert-icon"></i>;
		primaryColorr = '#007bff' //blue
	}
	else if(account?.Displayed === 5)
	{
		icon = <i className="fa-solid fa-check-circle alert-icon"></i>;
		primaryColorr = '#00ff115a' //green
	}
	if (account) {
		useEffect(() => {
			if (account.Displayed !== 1) {
				setTimeout(() => {
					account.setDisplayed(1);
				}, 2000);
			}
		}, [account.Displayed]);
		return (
			<div style={{ backgroundColor: primaryColorr, color: "white",}}
				 className={`alert-acountDeleted
         		${account.Displayed !== 1 ? "show" : "hide"}`}>
				{icon}
				{children}
			</div>
		);
	}
}

export default Alert;
