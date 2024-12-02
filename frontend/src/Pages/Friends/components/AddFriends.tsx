import React, { useEffect, useRef, useState } from "react";
import "./AddFriends.css";
import axios from "axios";
import { getendpoint } from "../../../context/getContextData";

interface AllUsers {
	id: number;
	username: string;
	avatar: string;
}

const AddFriends = () => {
	const [searchFriend, setSearchFriend] = useState("");
	const [focusOnSearch, setFocusOnSearch] = useState(false);
	const ChangeSearchRef = useRef<HTMLDivElement>(null);
	const Ref = useRef<HTMLInputElement>(null);
	const [allUsers, setAllUsers] = useState<AllUsers[]>([]);
	const [results, setResults] = useState<AllUsers[]>([]);

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
					getendpoint("/api/friends/users"),
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
		// const intervalId = setInterval(fetchUsers, 5000);

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
		try {
			await axios.post(
				"http://0.0.0.0:8000/api/friends/send/",
				{ receiver: id },
				{
					withCredentials: true,
				}
			);
			setAllUsers((prev) => prev.filter((user) => user.id !== id));
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};

	const friendsList = searchFriend ? results : allUsers;
	return (
		<div>
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
				{friendsList.map((friend) => {
					return (
						<div className="friendProfile" key={friend.id}>
							<div className="imageNameFriend">
								<img src={friend.avatar} alt="" className="friendImage" />
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
			</>
		</div>
	);
};

export default AddFriends;
