import React, { useEffect, useRef, useState } from "react";
import "./CancelFriends.css";
import axios from "axios";
import { getContext, getendpoint } from "../../../context/getContextData";
import { useNavigate } from "react-router-dom";

interface PendingUsers {
	id: number;
	username: string;
	avatar: string;
}

const CancelFriends = () => {
	const navigate = useNavigate();
	const [searchFriend, setSearchFriend] = useState("");
	const [focusOnSearch, setFocusOnSearch] = useState(false);
	const ChangeSearchRef = useRef<HTMLDivElement>(null);
	const Ref = useRef<HTMLInputElement>(null);
	const [pendingUsers, setPendingUsers] = useState<PendingUsers[]>([]);
	const [results, setResults] = useState<PendingUsers[]>([]);
	const authContext = getContext();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				ChangeSearchRef.current &&
				!ChangeSearchRef.current.contains(event.target as Node) &&
				Ref.current &&
				!Ref.current.contains(event.target as Node) &&
				searchFriend.trim() === ""
			) {
				setFocusOnSearch(false);
			}
		};

		const fetchUsers = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", "/api/friends/cancel"),
					{
						withCredentials: true,
					}
				);
				setPendingUsers(response.data);
			} catch (err) {
				console.log("Error fetching users:", err);
			}
		};

		fetchUsers();

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			// clearInterval(intervalId);
		};
	}, [searchFriend]);

	const handleSearchFriend = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		setSearchFriend(value);
		const filterResults = pendingUsers.filter((user) =>
			user.username.toLowerCase().includes(value.toLowerCase())
		);
		setResults(filterResults);
	};

	const handleReturnToList = () => {
		setFocusOnSearch(false);
		setSearchFriend("");
	};

	const handleCancelRequests = async (id: number) => {
		const existingFriend = pendingUsers.find((friend) => friend.id === id);
		if (!existingFriend) return;
		try {
			await axios
				.delete(getendpoint("http", `/api/friends/cancel/${id}`), {
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
						authContext?.setDisplayed(2);
					}
					setPendingUsers((prev) => prev.filter((user) => user.id !== id));
				});
		} catch (error) {
			console.error("Error decline friend request:", error);
		}
	};

	const friendsList = searchFriend ? results : pendingUsers;
	return (
		<div className="cancel-friends-page">
			<>
				<div className="searchFriend">
					<div className="searchfrienContainer">
						{focusOnSearch ? (
							<i
								className="fa-solid fa-arrow-left arrow-icon"
								onClick={handleReturnToList}
								ref={ChangeSearchRef}
							></i>
						) : (
							<i className="fa-solid fa-magnifying-glass search-icon"></i>
						)}
						<input
							type="text"
							placeholder="search..."
							value={searchFriend}
							onChange={handleSearchFriend}
							onFocus={() => setFocusOnSearch(true)}
							ref={Ref}
						/>
					</div>
				</div>
				<div className="cancel-friends">
					{friendsList.map((friend) => {
						return (
							<div className="friendProfile" key={friend.id}>
								<div className="imageNameFriend">
									<img
										src={getendpoint("http", friend.avatar)}
										alt=""
										className="friendImage"
										onClick={() => navigate(`/profile/${friend.username}`)}
									/>
									<span>{friend.username}</span>
								</div>
								<button
									className="cancelFriend"
									onClick={() => handleCancelRequests(friend.id)}
								>
									Decline Friend
								</button>
							</div>
						);
					})}
				</div>
			</>
		</div>
	);
};

export default CancelFriends;
