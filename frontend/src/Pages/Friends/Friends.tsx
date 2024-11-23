import { useState } from "react";
import "./Friends.css";
import { Friend } from "../Chat/components/types.ts";
import AllFriends from "./components/AllFriends.tsx";
import FriendRequests from "./components/FriendRequests.tsx";
import AddFriends from "./components/AddFriends.tsx";
import BlockedFriends from "./components/BlockedFriends.tsx";

// import axios from "axios";

const Friends = () => {
	const [results, setResults] = useState<Friend[]>([]);
	const [activeSection, setActiveSection] = useState("allFriends");

	// useEffect(() => {
	// 	axios.get("http://0.0.0.0:8000/api/friends/friends/", {
	// 		withCredentials: true, // Include cookies in the request
	// 	})
	// 	.then(response => {
	// 		console.log(response.data); // Set the response data to state
	// 	})
	// 	.catch(err => {
	// 		  console.log(err.data); // Set the response data to state
	// 	  });
	// }, []);
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
				{activeSection === "addFriends" && (
					<AddFriends/>
				)}
				{activeSection === "blockedFriends" && (
					<BlockedFriends  />
				)}
			</div>
		</div>
	);
};

export default Friends;
