import { useEffect, useRef, useState } from "react";
import ChatList from "./ChatList";
import "./List.css";
import { GetChats, GetFriends } from "./context/ChatUseContext";

interface ListProps {
	friends: GetFriends[];
	onSelectFriend: (friend: GetChats) => void;
	selectedFriend: GetChats | null;
}

const ListChat = ({ friends, onSelectFriend, selectedFriend }: ListProps) => {
	const [searchFriend, setSearchFriend] = useState("");
	const [results, setResults] = useState<GetFriends[]>([]);
	const [focusOnSearch, setFocusOnSearch] = useState(false);
	const [listAllFriends, setListAllFriends] = useState(false);
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
			user.username.toLowerCase().includes(value.toLowerCase())
		);
		setResults(filterResults);
	};

	const handleReturnToList = () => {
		setFocusOnSearch(false);
		setSearchFriend("");
	};

	return (
		<div className="chat-list">
			<div className="chat-container">
				<div>Messages</div>
				{!listAllFriends ? (
					<img
						src="/ChatImages/newChat.svg"
						alt="New Chat"
						className="newChat"
						onClick={() => setListAllFriends((prev) => !prev)}
					/>
				) : (
					<img
						src="/ChatImages/Vector.png"
						alt="New Chat"
						className="newChat"
						onClick={() => setListAllFriends((prev) => !prev)}
					/>
				)}
			</div>
			<div className="chat-search">
				<div className="chat-search-container">
					<div className="chat-iconSearch">
						{focusOnSearch ? (
							<i
								className="fa-solid fa-arrow-left chat-arrow-icon"
								onClick={handleReturnToList}
								ref={ChangeSearchRef}
							></i>
						) : (
							<i className="fa-solid fa-magnifying-glass chat-search-icon"></i>
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
			{searchFriend && results.length === 0 ? (
				<div className="NotFoundChat">No results found for your search.</div>
			) : (
				<ChatList
					friends={searchFriend ? results : friends}
					onSelectFriend={onSelectFriend}
					selectedFriend={selectedFriend}
					setSearchFriend={setSearchFriend}
					setFocusOnSearch={setFocusOnSearch}
					listAllFriends={listAllFriends}
					setListAllFriends={setListAllFriends}
				/>
			)}
		</div>
	);
};

export default ListChat;
