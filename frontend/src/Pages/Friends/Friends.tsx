import { useState } from "react";
import "./Friends.css";
import AllFriends from "./components/AllFriends.tsx";
import FriendRequests from "./components/FriendRequests.tsx";
import AddFriends from "./components/AddFriends.tsx";
import BlockedFriends from "./components/BlockedFriends.tsx";


const Friends = () => {
	const [activeSection, setActiveSection] = useState("allFriends");

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
				</ul>
			</div>
			<div className="bodyFriends">
				{activeSection === "allFriends" && <AllFriends/>}
				{activeSection === "friendRequests" && <FriendRequests/>}
				{activeSection === "addFriends" && <AddFriends/>}
				{activeSection === "blockedFriends" && <BlockedFriends/>}
			</div>
		</div>
	);
};

export default Friends;
