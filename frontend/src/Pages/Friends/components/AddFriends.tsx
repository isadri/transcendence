import React, { useEffect, useRef, useState } from "react";
import "./AddFriends.css";
import axios from "axios";
import { getContext, getendpoint } from "../../../context/getContextData";
import { useNavigate } from "react-router-dom";

interface AllUsers {
	id: number;
	username: string;
	avatar: string;
}

const AddFriends = () => {
	const navigate = useNavigate();
	const [searchFriend, setSearchFriend] = useState("");
	const [focusOnSearch, setFocusOnSearch] = useState(false);
	const ChangeSearchRef = useRef<HTMLDivElement>(null);
	const Ref = useRef<HTMLInputElement>(null);
	const [allUsers, setAllUsers] = useState<AllUsers[]>([]);
	const [results, setResults] = useState<AllUsers[]>([]);
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
					getendpoint("http", "/api/friends/usersUnfriends"),
					// "http://0.0.0.0:8000/api/friends/users",
					{
						withCredentials: true,
					}
				);
				setAllUsers(response.data);
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
		const filterResults = allUsers.filter((user) =>
			user.username.toLowerCase().includes(value.toLowerCase())
		);
		setResults(filterResults);
	};

	const handleReturnToList = () => {
		setFocusOnSearch(false);
		setSearchFriend("");
	};

	const handleSendRequests = async (id: number) => {
		const existingFriend = allUsers.find((friend) => friend.id === id);
		if (!existingFriend) return;
		try {
			await axios
				.post(
					getendpoint("http", "/api/friends/send/"),
					{ receiver: id },
					{
						withCredentials: true,
					}
				)
				.then((response) => {
					if (
						response.data.error ==
						"A friend request already exists between you and this user."
					) {
						authContext?.setCreatedAlert(
							"A friend request already exists between you and this user."
						);
						authContext?.setDisplayed(2);
					}
					setAllUsers((prev) => prev.filter((user) => user.id !== id));
				});
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};

	const friendsList = searchFriend ? results : allUsers;
	// console.log(friendsList)
	return (
		<div className="add-friends-page">
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
				<div className="add-friends">
					{friendsList.map((friend) => {
						return (
							<div className="friendProfile" key={friend.id}>
								<div className="imageNameFriend">
									<img
										src={friend.avatar}
										alt=""
										className="friendImage"
										onClick={() => navigate(`/profile/${friend.username}`)}
									/>
									<span>{friend.username}</span>
								</div>
								<button
									className="addFriend"
									onClick={() => handleSendRequests(friend.id)}
								>
									Add Friend
								</button>
							</div>
						);
					})}
				</div>
			</>
		</div>
	);
};

export default AddFriends;
