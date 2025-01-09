import React, { useEffect, useState } from "react";
import "./BlockedFriends.css";
import axios from "axios";
import {
	getContext,
	getUser,
	getendpoint,
} from "../../../context/getContextData.tsx";

interface BlockedFriend {
	id: number;
	username: string;
	avatar: string;
}

const BlockedFriends = () => {
	const [blockedfriend, setBlockedFriend] = useState<BlockedFriend[]>([]);
	const user = getUser();
	const authContext = getContext();

	useEffect(() => {
		const fetchBlockedFriend = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", "/api/friends/blocked"),
					{
						withCredentials: true, // Include cookies in the request
					}
				);
				const senderData = response.data.map((request: any) => {
					const friend_id =
						user?.id === request.sender.id
							? request.receiver.id
							: request.sender.id;

					const username =
						user?.id === request.sender.id
							? request.receiver.username
							: request.sender.username;

					const avatar =
						user?.id === request.sender.id
							? request.receiver.avatar
							: request.sender.avatar;

					return {
						id: friend_id,
						username: username,
						avatar: avatar,
					};
				});
				setBlockedFriend(senderData);
			} catch (err) {
				console.error("Error fetching data:", err);
			}
		};

		fetchBlockedFriend();
	}, []);

	const handleUnblockRequests = async (id: number) => {
		const existingFriend = blockedfriend.find((friend) => friend.id === id);
		if (!existingFriend) return;
		try {
			await axios
				.post(getendpoint("http", `/api/friends/unblock/${id}`), null, {
					withCredentials: true,
				})
				.then((response) => {
					if (response.data.error == "No blocked request found.") {
						authContext?.setCreatedAlert("No blocked request found.");
						authContext?.setDisplayed(3);
					}
					setBlockedFriend((prev) => prev.filter((user) => user.id !== id));
				});
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};

	return (
		<div className="blocked-friends-page">
			{blockedfriend.map((friend) => {
				return (
					<div className="friendProfile" key={friend.id}>
						<div className="imageNameFriend">
							<img
								src={getendpoint("http", friend.avatar)}
								alt=""
								className="blockedImage"
							/>
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
