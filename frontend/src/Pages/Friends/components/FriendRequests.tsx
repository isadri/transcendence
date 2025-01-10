import { useEffect, useState } from "react";
import "./FriendRequests.css";
import axios from "axios";
import { getContext, getendpoint } from "../../../context/getContextData";
import { useNavigate } from "react-router-dom";

interface FriendRequests {
	id: number;
	username: string;
	avatar: string;
}

const FriendRequests = () => {
	const navigate = useNavigate();
	const [friendRequests, setFriendRequests] = useState<FriendRequests[]>([]);
	const authContext = getContext();

	useEffect(() => {
		const fetchFriendRequests = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", "/api/friends/pending"),
					{
						withCredentials: true,
					}
				);
				const senderData = response.data.map((request: any) => ({
					id: request.sender.id,
					username: request.sender.username,
					avatar: request.sender.avatar,
				}));

				setFriendRequests(senderData);
			} catch (err) {}
		};

		fetchFriendRequests();
	}, []);

	const handleAcceptRequest = async (id: number) => {
		try {
			await axios
				.post(getendpoint("http", `/api/friends/accept/${id}`), null, {
					withCredentials: true,
				})
				.then((response) => {
					if (
						response.data.error ===
						"Friend request not found or already processed."
					) {
						authContext?.setCreatedAlert(
							"Friend request not found or already processed."
						);
						authContext?.setDisplayed(3);
					}
					setFriendRequests((prev) => prev.filter((user) => user.id !== id));
				});
		} catch (error) {}
	};

	const handleDeleteRequests = async (id: number) => {
		try {
			await axios
				.delete(getendpoint("http", `/api/friends/decline/${id}`), {
					withCredentials: true,
				})
				.then((response) => {
					if (
						response.data.error ==
						"Friend request not found or already processed."
					) {
						authContext?.setCreatedAlert(
							"Friend request not found or already processed."
						);
						authContext?.setDisplayed(3);
					}
					setFriendRequests((prev) => prev.filter((user) => user.id !== id));
				});
		} catch (error) {}
	};

	return (
		<div className="requests-friends-page">
			{friendRequests.map((friend) => {
				return (
					<div className="friendProfile friendRequests" key={friend.id}>
						<div className="imageNameFriend">
							<img
								src={getendpoint("http", friend.avatar)}
								alt=""
								className="friendImage"
								onClick={() => navigate(`/profile/${friend.username}`)}
							/>
							<span
								className="friendName"
								onClick={() => navigate(`/profile/${friend.username}`)}
							>
								{friend.username}
							</span>
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
