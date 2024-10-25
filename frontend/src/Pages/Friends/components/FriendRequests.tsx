import React, { useState } from "react";
import DataFriends from "../../Chat/components/DataFriends.tsx";
import { Friend } from "../../Chat/components/types.ts";
import "./FriendRequests.css"

interface FriendRequestsProps {
	displayFriendRequests: boolean;
	setResults: React.Dispatch<React.SetStateAction<Friend[]>>;
}

const FriendRequests = ({
	displayFriendRequests,
	setResults,
}: FriendRequestsProps) => {
	const [allFriends, setAllFriends] = useState<Friend[]>(DataFriends);

	const handleDeleteRequests = (id: number) => {
		setAllFriends((prevFriends) =>
			prevFriends.filter((friend) => friend.id !== id)
		);
		setResults((prevResults) =>
			prevResults.filter((friend) => friend.id !== id)
		);
	};
	return (
		<div>
			{displayFriendRequests && (
				<>
					{" "}
					{allFriends.map((friend) => {
						return (
							<div className="friendProfile friendRequests" key={friend.id}>
								<div className="imageNameFriend">
									<img src={friend.profile} alt="" className="friendImage" />
									<span>{friend.name}</span>
								</div>
								<div className="buttonFriend">
									<button className="confirm">Confirm</button>
									<button
										className="delete"
										onClick={() => handleDeleteRequests(friend.id)}
									>
										Delete
									</button>
								</div>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
};

export default FriendRequests;
