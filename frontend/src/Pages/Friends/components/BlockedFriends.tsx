import React, { useEffect, useState } from "react";
import DataFriends from "../../Chat/components/DataFriends.tsx";
import { Friend } from "../../Chat/components/types.ts";
import "./BlockedFriends.css";
import axios from "axios";

interface BlockedFriend {
	id: number;
	username: string;
	avatar: string;
}

const BlockedFriends = () => {
	const [blockedfriend, setBlockedFriend] = useState<BlockedFriend[]>([]);

	useEffect(() => {
		const fetchBlockedFriend = () => {
			axios
				.get("http://0.0.0.0:8000/api/friends/blocked", {
					withCredentials: true, // Include cookies in the request
				})
				.then((response) => {
					const senderData = response.data.map((request: any) => ({
						id: request.sender.id,
						username: request.sender.username,
						avatar: request.sender.avatar,
					}));

					setBlockedFriend(senderData);
				})
				.catch((err) => {
					console.error("Error fetching data:", err);
				});
		};

		fetchBlockedFriend();
		// Set up an interval to fetch new data every 10 seconds
		// const intervalId = setInterval(fetchBlockedFriend, 5000);

		// Clean up the interval when the component unmounts
		// return () => {
		// 	clearInterval(intervalId);
		// };
	}, []);

	const handleUnblockRequests = (id: number) => {
		axios
			.post(`http://0.0.0.0:8000/api/friends/unblock/${id}`, null, {
				withCredentials: true,
			})
			.then(() => {
				setBlockedFriend((prev) =>
					prev.filter((request) => request.id !== id)
				);
			})
			.catch((error) => {
				console.error("Error accepting friend request:", error);
			});
	};

	return (
		<div>
				{blockedfriend.map((friend) => {
					return (
						<div className="friendProfile BlockedFriend" key={friend.id}>
							<div className="imageNameFriend">
								<img src={friend.avatar} alt="" className="friendImage" />
								<span>{friend.username}</span>
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
		</div>
	);
};

export default BlockedFriends;
