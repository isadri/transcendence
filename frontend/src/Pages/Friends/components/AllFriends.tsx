import React, { useEffect, useRef, useState } from "react";
import "./AllFriends.css";
import axios from "axios";
import { getContext, getendpoint } from "../../../context/getContextData";
import { useNavigate } from "react-router-dom";

interface GetFriends {
	id: number;
	username: string;
	avatar: string;
	is_online: boolean
}

const AllFriends = () => {
	const navigate = useNavigate();
	const [results, setResults] = useState<GetFriends[]>([]);
	const [searchFriend, setSearchFriend] = useState("");
	const [focusOnSearch, setFocusOnSearch] = useState(false);
	const ChangeSearchRef = useRef<HTMLDivElement>(null);
	const Ref = useRef<HTMLInputElement>(null);
	const [getFriends, setGetFriends] = useState<GetFriends[]>([]);
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

		document.addEventListener("mousedown", handleClickOutside);

		const fetchFriend = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", "/api/friends/friends"),
					{
						withCredentials: true, // Include cookies in the request
					}
				);
				setGetFriends(response.data.friends);
			} catch (err) {
				console.log("Error to fetch friends.", err); // Set the response data to state
			}
		};

		fetchFriend();

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			// clearInterval(intervalId);
		};
	}, [searchFriend]);

	const handleSearchFriend = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		setSearchFriend(value);
		const filterResults = getFriends.filter((user) =>
			user.username.toLowerCase().includes(value.toLowerCase())
		);
		setResults(filterResults);
	};

	const handleReturnToList = () => {
		setFocusOnSearch(false);
		setSearchFriend("");
	};

	const handleRemoveRequests = async (id: number) => {
		const existingFriend = getFriends.find((friend) => friend.id === id);
		if (!existingFriend) return;
		try {
			await axios
				.post(getendpoint("http", `/api/friends/remove/${id}`), null, {
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
						authContext?.setDisplayed(2);
					}
					setGetFriends((prev) => prev.filter((user) => user.id !== id));
				});
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};
	const handleBlockRequests = async (id: number) => {
		try {
			await axios
				.post(getendpoint("http", `/api/friends/block/${id}`), null, {
					withCredentials: true,
				})
				.then((response) => {
					// console.log(response.data)
					if (response.data.error === "You can not block this user.") {
						authContext?.setCreatedAlert("You can not block this user.");
						authContext?.setDisplayed(2);
					}
					setGetFriends((prev) => prev.filter((user) => user.id !== id));
				});
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};

	const friendsList = searchFriend ? results : getFriends;
	return (
		<div className="all-friends-page">
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
				<div className="all-friends">
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
									{
           							  	friend.is_online ?
           							 	  <div className="onlineCircle-friend"></div>
           							 	  :
           							 	  <div className="onlineCircle-friend" style={{backgroundColor:'rgb(119 118 118)', borderColor:'rgb(119 118 118)'}}></div>
           							}
									<span>{friend.username}</span>
								</div>
								<div className="iconFriend">
									<button
										className="block"
										onClick={() => handleBlockRequests(friend.id)}
									>
										Block
									</button>
									<button
										className="remove"
										onClick={() => handleRemoveRequests(friend.id)}
									>
										Remove
									</button>
									{/* <i className="fa-solid fa-user user"></i>
								<i className="fa-solid fa-comment-dots chat"></i> */}
								</div>
							</div>
						);
					})}
				</div>
			</>
		</div>
	);
};

export default AllFriends;
