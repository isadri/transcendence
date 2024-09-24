import { /*useEffect, useRef, */ useState } from "react";
import "./Friends.css";
import { Friend } from "../Chat/components/types.ts";
import DataFriends from "../Chat/components/DataFriends.tsx";
import AllFriends from "./components/AllFriends.tsx";

const Friends = () => {
	// const [searchFriend, setSearchFriend] = useState("");
	const [results, setResults] = useState<Friend[]>([]);
	// const [focusOnSearch, setFocusOnSearch] = useState(false);
	const [allFriends, setAllFriends] = useState<Friend[]>(DataFriends);
	// const ChangeSearchRef = useRef<HTMLDivElement>(null);
	// const Ref = useRef<HTMLInputElement>(null);
	const [displayAllFriends, setDisplayAllFriends] = useState(false);
	const [displayFriendRequests, setDisplayFriendRequests] = useState(false);

	// useEffect(() => {
	// 	const handleClickOutside = (event: MouseEvent) => {
	// 		if (
	// 			ChangeSearchRef.current &&
	// 			!ChangeSearchRef.current.contains(event.target as Node) &&
	// 			Ref.current &&
	// 			!Ref.current.contains(event.target as Node) &&
	// 			searchFriend.trim() === ""
	// 		) {
	// 			setFocusOnSearch(false);
	// 		}
	// 	};

	// 	document.addEventListener("mousedown", handleClickOutside);

	// 	return () => {
	// 		document.removeEventListener("mousedown", handleClickOutside);
	// 	};
	// }, [searchFriend]);

	// const handleSearchFriend = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const value = event.target.value;

	// 	setSearchFriend(value);
	// 	const filterResults = DataFriends.filter((user) =>
	// 		user.name.toLowerCase().includes(value.toLowerCase())
	// 	);
	// 	setResults(filterResults);
	// };

	// const handleReturnToList = () => {
	// 	setFocusOnSearch(false);
	// 	setSearchFriend("");
	// };

	const handleDeleteRequests = (id: number) => {
		setAllFriends((prevFriends) =>
			prevFriends.filter((friend) => friend.id !== id)
		);
		setResults((prevResults) =>
			prevResults.filter((friend) => friend.id !== id)
		);
	};

	// const friendsList = searchFriend ? results : DataFriends;

	return (
		<div className="FriendContainer">
			<div className="menuFriends">
				<ul>
					<li
						onClick={() => {
							setDisplayAllFriends((prev) => !prev);
							setDisplayFriendRequests(false);
						}}
						className={`all ${displayAllFriends ? "selectedItem" : ""}`}
					>
						All Friends
					</li>
					<li
						className={`${displayFriendRequests ? "selectedItem" : ""}`}
						onClick={() => {
							setDisplayFriendRequests((prev) => !prev);
							setDisplayAllFriends(false);
						}}
					>
						Friend Requests
					</li>
					<li>Add Friend</li>
					<li>Blocked Friend</li>
				</ul>
			</div>
			<div className="bodyFriends">
				<AllFriends displayAllFriends={displayAllFriends} results={results} setResults={setResults} />
				{/* {displayAllFriends && (
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
										<i className="fa-solid fa-comment-dots"></i>
									</div>
								</div>
							);
						})}
					</>
				)} */}
				{displayFriendRequests && (
					<>
						{" "}
						{allFriends.map((friend) => {
							return (
								<div className="friendProfile friendRequests" key={friend.id}>
									<div className="imageNameFriend">
										<img src={friend.profile} alt="" className="friendImage" />
										<span>{friend.name}</span>
									</div>
									<div className="buttonFriend">
										<button className="confirm">Confirm</button>
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
					</>
				)}
			</div>
		</div>
	);
};

export default Friends;
