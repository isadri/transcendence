import { useState } from "react";
import "./Friends.css";
import { Friend } from "../Chat/components/types.ts";
import AllFriends from "./components/AllFriends.tsx";
import FriendRequests from "./components/FriendRequests.tsx";

const Friends = () => {
	const [results, setResults] = useState<Friend[]>([]);
	const [displayAllFriends, setDisplayAllFriends] = useState(false);
	const [displayFriendRequests, setDisplayFriendRequests] = useState(false);

	return (
		<div className="FriendContainer">
			<div className="menuFriends">
				<ul>
					<li
						onClick={() => {
							setDisplayAllFriends((prev) => !prev);
							setDisplayFriendRequests(false);
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
						}}
					>
						Friend Requests
					</li>
					<li>Add Friend</li>
					<li>Blocked Friend</li>
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
			</div>
		</div>
	);
};

export default Friends;
