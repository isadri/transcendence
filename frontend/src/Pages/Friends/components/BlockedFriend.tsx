import React, { useState } from "react";
import DataFriends from "../../Chat/components/DataFriends.tsx";
import { Friend } from "../../Chat/components/types.ts";
import "./BlockedFriend.css";

interface BlockedFriendProps {
	displayBlockedFriend: boolean;
	setResults: React.Dispatch<React.SetStateAction<Friend[]>>;
}

const BlockedFriend = ({
	displayBlockedFriend,
	setResults,
}: BlockedFriendProps) => {
	const [allFriends, setAllFriends] = useState<Friend[]>(DataFriends);

	const handleUnblockRequests = (id: number) => {
		setAllFriends((prevFriends) =>
			prevFriends.filter((friend) => friend.id !== id)
		);
		setResults((prevResults) =>
			prevResults.filter((friend) => friend.id !== id)
		);
	};
	return (
		<div>
			{displayBlockedFriend && (
				<>
					{" "}
					{allFriends.map((friend) => {
						return (
							<div className="friendProfile BlockedFriend" key={friend.id}>
								<div className="imageNameFriend">
									<img src={friend.profile} alt="" className="friendImage" />
									<span>{friend.name}</span>
								</div>
								<button
									className="unblock"
									onClick={() => handleUnblockRequests(friend.id)}
								>
									Unblock
								</button>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
};

export default BlockedFriend;
