import React, { useEffect, useRef, useState } from "react";
import "./AddFriends.css"
import axios from "axios";

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
	const [allUsers, setAllUsers] = useState<AllUsers[]>([])
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

		const fetchUsers = () => {
			axios.get("http://0.0.0.0:8000/api/friends/users", {
				withCredentials: true, // Include cookies in the request
			})
			.then(response => {
				// console.log(response.data); // Set the response data to state
				setAllUsers(response.data)
			})
			.catch(err => {
					console.log(err.data); // Set the response data to state
			  });
		}

		fetchUsers()
		const intervalId = setInterval(fetchUsers, 5000);

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			clearInterval(intervalId);
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

	const handleSendRequests = (id: number) => {
		axios
			.post("http://0.0.0.0:8000/api/friends/send/", {receiver: id}, {
				withCredentials: true,
			})
			.then(() => {
				setAllUsers((prev) =>
					prev.filter((request) => request.id !== id)
				);
			})
			.catch((error) => {
				console.error("Error accepting friend request:", error);
			});
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
							<button className="addFriend"
									onClick={() => handleSendRequests(friend.id)}
							>Add Friend</button>
						</div>
					);
				})}
			</>
		</div>
	);
};

export default AddFriends;
