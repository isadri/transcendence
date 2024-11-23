import React, { useEffect, useRef, useState } from "react";
import "./AllFriends.css";
import axios from "axios";

interface GetFriends {
	id: number;
	username: string;
	avatar: string;
}

const AllFriends = () => {
	const [results, setResults] = useState<GetFriends[]>([]);
	const [searchFriend, setSearchFriend] = useState("");
	const [focusOnSearch, setFocusOnSearch] = useState(false);
	const ChangeSearchRef = useRef<HTMLDivElement>(null);
	const Ref = useRef<HTMLInputElement>(null);
	const [getFriends, setGetFriends] = useState<GetFriends[]>([])

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

		axios.get("http://0.0.0.0:8000/api/friends/friends/", {
			withCredentials: true, // Include cookies in the request
		})
		.then(response => {
			// console.log(response.data); // Set the response data to state
			setGetFriends(response.data.friends)
		})
		.catch(err => {
				console.log(err.data); // Set the response data to state
		  });

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
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

	const friendsList = searchFriend ? results : getFriends;
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
							<div className="iconFriend">
								<i className="fa-solid fa-user user"></i>
								<i className="fa-solid fa-comment-dots chat"></i>
							</div>
						</div>
					);
				})}
			</>
		</div>
	);
};

export default AllFriends;
