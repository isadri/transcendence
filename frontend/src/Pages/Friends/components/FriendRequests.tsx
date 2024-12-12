import React, { useEffect, useState } from "react";
import "./FriendRequests.css";
import axios from "axios";
import { getendpoint } from "../../../context/getContextData";
import { useNavigate } from "react-router-dom";

interface FriendRequests {
	id: number;
	username: string;
	avatar: string;
}

const FriendRequests = () => {
	const navigate = useNavigate()
	const [friendRequests, setFriendRequests] = useState<FriendRequests[]>([]);

	useEffect(() => {
		const fetchFriendRequests = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", "/api/friends/pending"),
					// "http://0.0.0.0:8000/api/friends/pending",
					{
						withCredentials: true, // Include cookies in the request
					}
				);
				const senderData = response.data.map((request: any) => ({
					id: request.sender.id,
					username: request.sender.username,
					avatar: request.sender.avatar,
				}));

				setFriendRequests(senderData);
			} catch (err) {
				console.error("Error fetching data:", err);
			}
		};

		fetchFriendRequests();
		// Set up an interval to fetch new data every 10 seconds
		// const intervalId = setInterval(fetchFriendRequests, 5000);

		// Clean up the interval when the component unmounts
		// return () => {
		// 	// clearInterval(intervalId);
		// };
	}, []);

	const handleAcceptRequest = async (id: number) => {
		try {
			await axios.post(getendpoint("http", `/api/friends/accept/${id}`), null, {
				withCredentials: true,
			});
			setFriendRequests((prev) => prev.filter((user) => user.id !== id));
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};

	const handleDeleteRequests = async (id: number) => {
		try {
			await axios.delete(getendpoint("http", `/api/friends/decline/${id}`), {
				withCredentials: true,
			});
			setFriendRequests((prev) => prev.filter((user) => user.id !== id));
		} catch (error) {
			console.error("Error decline friend request:", error);
		}
	};
	return (
		<div>
			{friendRequests.map((friend) => {
				return (
					<div className="friendProfile friendRequests" key={friend.id}>
						<div className="imageNameFriend">
							<img src={friend.avatar} alt="" className="friendImage" onClick={() => navigate(`/profile/${friend.username}`)}/>
							<span>{friend.username}</span>
						</div>
						<div className="buttonFriend">
							<button
								className="confirm"
								onClick={() => handleAcceptRequest(friend.id)}
							>
								Confirm
							</button>
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
		</div>
	);
};

export default FriendRequests;
