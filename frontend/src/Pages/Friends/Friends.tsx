import { useState } from "react";
import "./Friends.css";
import { Friend } from "../Chat/components/types.ts";
import AllFriends from "./components/AllFriends.tsx";
import FriendRequests from "./components/FriendRequests.tsx";
import AddFriends from "./components/AddFriends.tsx";
import BlockedFriends from "./components/BlockedFriends.tsx";
// import { useMediaQuery } from "@uidotdev/usehooks"; // npm i @uidotdev/usehooks

const Friends = () => {
	// const isSmallDevice = useMediaQuery("only screen and (max-width : 478px)");
	const [results, setResults] = useState<Friend[]>([]);
	const [activeSection, setActiveSection] = useState("allFriends");

	return (
		<div className="FriendContainer">
			<div className="menuFriends">
				<ul>
					<li
						onClick={() => {
							setActiveSection("allFriends")
						}}
						className={`${activeSection == "allFriends" ? "selectedItem" : ""}`}
						>
						All Friends
					</li>
					<li
						className={`${activeSection == "friendRequests" ? "selectedItem" : ""}`}
						onClick={() => {
							setActiveSection("friendRequests")
						}}
						>
						Friend Requests
					</li>
					<li
						className={`${activeSection == "addFriends" ? "selectedItem" : ""}`}
						onClick={() => {
							setActiveSection("addFriends")
						}}
						>
						Add Friend
					</li>
					<li
						className={`${activeSection == "blockedFriends" ? "selectedItem" : ""}`}
						onClick={() => {
							setActiveSection("blockedFriends")
						}}
					>
						Blocked Friend
					</li>
				</ul>
			</div>
			<div className="bodyFriends">
			{activeSection === "allFriends" && <AllFriends results={results}
					setResults={setResults} />}
			{activeSection === "friendRequests" && <FriendRequests setResults={setResults} />}
			{activeSection === "addFriends" && <AddFriends results={results} setResults={setResults} />}
			{activeSection === "blockedFriends" && <BlockedFriends setResults={setResults} />}
			</div>
		</div>
	);
};

export default Friends;
