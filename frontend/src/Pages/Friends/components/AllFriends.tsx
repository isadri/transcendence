import React, { useEffect, useRef, useState } from "react";
import DataFriends from "../../Chat/components/DataFriends.tsx";
import { Friend } from "../../Chat/components/types.ts";
import "./AllFriends.css";

interface AllFriendsProps {
	results: Friend[];
	setResults: React.Dispatch<React.SetStateAction<Friend[]>>;
}

const AllFriends = ({
	results,
	setResults,
}: AllFriendsProps) => {
	const [searchFriend, setSearchFriend] = useState("");
	const [focusOnSearch, setFocusOnSearch] = useState(false);
	const ChangeSearchRef = useRef<HTMLDivElement>(null);
	const Ref = useRef<HTMLInputElement>(null);

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

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [searchFriend]);

	const handleSearchFriend = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		setSearchFriend(value);
		const filterResults = DataFriends.filter((user) =>
			user.name.toLowerCase().includes(value.toLowerCase())
		);
		setResults(filterResults);
	};

	const handleReturnToList = () => {
		setFocusOnSearch(false);
		setSearchFriend("");
	};

	const friendsList = searchFriend ? results : DataFriends;
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
								<img src={friend.profile} alt="" className="friendImage" />
								<span>{friend.name}</span>
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
