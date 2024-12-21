import { useState } from "react";
import "./Friends.css";
import AllFriends from "./components/AllFriends.tsx";
import FriendRequests from "./components/FriendRequests.tsx";
import AddFriends from "./components/AddFriends.tsx";
import BlockedFriends from "./components/BlockedFriends.tsx";
import CancelFriends from "./components/CancelFriends.tsx";
import Alert from "../../components/Alert/Alert.tsx";
import { getContext } from "../../context/getContextData.tsx";

const Friends = () => {
	const [activeSection, setActiveSection] = useState("allFriends");
	const account = getContext();

	return (
		<div className="Friend-Container">
			<div className="friendsMenuFriends">
				<ul>
					<li
						onClick={() => {
							setActiveSection("allFriends");
						}}
						className={`${activeSection == "allFriends" ? "selectedItem" : ""}`}
					>
						Friends
					</li>
					<li
						className={`${
							activeSection == "friendRequests" ? "selectedItem" : ""
						}`}
						onClick={() => {
							setActiveSection("friendRequests");
						}}
					>
						Friend Requests
					</li>
					<li
						className={`${activeSection == "addFriends" ? "selectedItem" : ""}`}
						onClick={() => {
							setActiveSection("addFriends");
						}}
					>
						Add Friend
					</li>
					<li
						className={`${
							activeSection == "blockedFriends" ? "selectedItem" : ""
						}`}
						onClick={() => {
							setActiveSection("blockedFriends");
						}}
					>
						Blocked Friend
					</li>
					<li
						className={`${
							activeSection == "cancelFriends" ? "selectedItem" : ""
						}`}
						onClick={() => {
							setActiveSection("cancelFriends");
						}}
					>
						Cancel Friend
					</li>
				</ul>
			</div>
			<div className="bodyFriends">
				<Alert primaryColor="#d42f2f" secondaryColor="white">
					<i className="fa-solid fa-circle-exclamation"></i>
					<span>{account?.createdAlert}</span>
				</Alert>
				{activeSection === "allFriends" && <AllFriends />}
				{activeSection === "friendRequests" && <FriendRequests />}
				{activeSection === "addFriends" && <AddFriends />}
				{activeSection === "blockedFriends" && <BlockedFriends />}
				{activeSection === "cancelFriends" && <CancelFriends />}
			</div>
		</div>
	);
};

export default Friends;
