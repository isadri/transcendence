import { useEffect, useRef, useState } from "react";
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
				<img src="/ChatImages/newChat.svg" alt="New Chat" className="newChat" />
			</div>
			<div className="search">
				<div className="search-container">
					<div className="iconSearch" >
						{focusOnSearch ? (
							<i
								className="fa-solid fa-arrow-left arrow-icon"
								onClick={handleReturnToList}
								ref={ChangeSearchRef}
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
						ref={Ref}
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
