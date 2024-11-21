import { useState } from "react";
import "./Friends.css";
import { Friend } from "../Chat/components/types.ts";
import AllFriends from "./components/AllFriends.tsx";
import FriendRequests from "./components/FriendRequests.tsx";
import AddFriends from "./components/AddFriends.tsx";
import BlockedFriend from "./components/BlockedFriend.tsx";

const Friends = () => {
	const [results, setResults] = useState<Friend[]>([]);
	const [displayAllFriends, setDisplayAllFriends] = useState(true);
	const [displayFriendRequests, setDisplayFriendRequests] = useState(false);
	const [displayAddFriends, setDisplayAddFriends] = useState(false);
	const [displayBlockedFriend, setDisplayBlockedFriend] = useState(false);

	return (
		<div className="FriendContainer">
			<div className="menuFriends">
				<ul>
					<li
						onClick={() => {
							setDisplayAllFriends((prev) => !prev);
							setDisplayFriendRequests(false);
							setDisplayAddFriends(false);
							setDisplayBlockedFriend(false);
						}}
						className={`all ${displayAllFriends ? "selectedItem" : ""}`}
					>
						All Friends
					</li>
					<li
						className={`${displayFriendRequests ? "selectedItem" : ""}`}
						onClick={() => {
							setDisplayFriendRequests((prev) => !prev);
							setDisplayAllFriends(false);
							setDisplayAddFriends(false);
							setDisplayBlockedFriend(false);
						}}
					>
						Friend Requests
					</li>
					<li
						className={`${displayAddFriends ? "selectedItem" : ""}`}
						onClick={() => {
							setDisplayAddFriends((prev) => !prev);
							setDisplayFriendRequests(false);
							setDisplayAllFriends(false);
							setDisplayBlockedFriend(false);
						}}
						>
						Add Friend
					</li>
					<li
						className={`${displayBlockedFriend ? "selectedItem" : ""}`}
						onClick={() => {
							setDisplayBlockedFriend((prev) => !prev);
							setDisplayFriendRequests(false);
							setDisplayAllFriends(false);
							setDisplayAddFriends(false);
						}}
					>
						Blocked Friend
					</li>
				</ul>
			</div>
			<div className="bodyFriends">
				<AllFriends
					displayAllFriends={displayAllFriends}
					results={results}
					setResults={setResults}
				/>
				<FriendRequests
					displayFriendRequests={displayFriendRequests}
					setResults={setResults}
				/>
				<AddFriends
					displayAddFriends={displayAddFriends}
					results={results}
					setResults={setResults}
				/>
				<BlockedFriend
					displayBlockedFriend={displayBlockedFriend}
					setResults={setResults}
				/>
			</div>
		</div>
	);
};

export default Friends;
