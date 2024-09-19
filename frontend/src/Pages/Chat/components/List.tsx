import { useState } from "react";
import ChatList from "./ChatList";
import "./List.css";
import { Friend } from "./types";

interface ListProps {
	friends: Friend[];
	onSelectFriend: (friend: Friend) => void;
	selectedFriend: Friend | null;
}

const List = ({ friends, onSelectFriend, selectedFriend }: ListProps) => {
	const [searchFriend, setSearchFriend] = useState("");
	const [results, setResults] = useState<Friend[]>([]);
	const [focusOnSearch, setFocusOnSearch] = useState(false);
	const [openMsgMenu, setOpenMsgMenu] = useState(false);

	const handleSearchFriend = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchFriend(value);
		const filterResults = friends.filter((user) =>
			user.name.toLowerCase().includes(value.toLowerCase())
		);
		setResults(filterResults);
	};

	const handleReturnToList = () => {
		setFocusOnSearch(false);
		setSearchFriend("");
	};

	return (
		<div className="list">
			<div className="container">
				<div>Messages</div>
				<i
					className={`fa-solid fa-ellipsis-vertical iconMenu ${
						openMsgMenu ? "activeMenu" : ""
					}`}
					onClick={() => setOpenMsgMenu(!openMsgMenu)}
				></i>
				{openMsgMenu && <ul className="container-list">
					<li>Profile</li>
					<li>Setting</li>
				</ul>}
			</div>
			<div className="search">
				<div className="search-container">
					<div className="iconSearch">
						{focusOnSearch ? (
							<i
								className="fa-solid fa-arrow-left arrow-icon"
								onClick={handleReturnToList}
							></i>
						) : (
							<i className="fa-solid fa-magnifying-glass search-icon"></i>
						)}
					</div>
					<input
						type="text"
						placeholder="search..."
						value={searchFriend}
						onChange={handleSearchFriend}
						onFocus={() => setFocusOnSearch(true)}
					/>
				</div>
			</div>
			{searchFriend && results.length === 0 && (
				<div className="NotFoundChat">No results found for your search.</div>
			)}
			<ChatList
				friends={searchFriend ? results : friends}
				onSelectFriend={onSelectFriend}
				selectedFriend={selectedFriend}
				setSearchFriend={setSearchFriend}
				setFocusOnSearch={setFocusOnSearch}
			/>
		</div>
	);
};

export default List;
