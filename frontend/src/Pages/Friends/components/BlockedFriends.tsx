import React, { useEffect, useState } from "react";
import "./BlockedFriends.css";
import axios from "axios";
import { getUser, getendpoint } from "../../../context/getContextData.tsx";
import { useNavigate } from "react-router-dom";

interface BlockedFriend {
	id: number;
	username: string;
	avatar: string;
}

const BlockedFriends = () => {
	const navigate = useNavigate()
	const [blockedfriend, setBlockedFriend] = useState<BlockedFriend[]>([]);
	const user = getUser()

	useEffect(() => {
		const fetchBlockedFriend = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", "/api/friends/blocked"),
					// "http://0.0.0.0:8000/api/friends/blocked",
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
		// Set up an interval to fetch new data every 10 seconds
		// const intervalId = setInterval(fetchBlockedFriend, 5000);

		// Clean up the interval when the component unmounts
		// return () => {
		// 	clearInterval(intervalId);
		// };
	}, []);

	const handleUnblockRequests = async (id: number) => {
		const existingFriend = blockedfriend.find(
			(friend) => friend.id === id
		);
		if (!existingFriend)
			return;
		try {
			await axios.post(getendpoint("http", `/api/friends/unblock/${id}`), null, {
				withCredentials: true,
			});
			setBlockedFriend((prev) => prev.filter((user) => user.id !== id));
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};

	return (
		<div>
			{blockedfriend.map((friend) => {
				return (
					<div className="friendProfile BlockedFriend" key={friend.id}>
						<div className="imageNameFriend">
							<img src={friend.avatar} alt="" className="friendImage" onClick={() => navigate(`/profile/${friend.username}`)}/>
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
