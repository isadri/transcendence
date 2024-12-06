import "./ChatTop.css";
import { useEffect, useRef, useState } from "react";
// import { ChatMessage } from "./ChatList";
// import { GetChats } from "./ChatList";
import { useChatContext, GetChats } from "./context/ChatUseContext";
import { getUser, getendpoint } from "../../../context/getContextData";
import axios from "axios";

interface ChatTopProps {
	selectedFriend: GetChats;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetChats | null>>;
	setBlock: React.Dispatch<React.SetStateAction<boolean>>;
	block: boolean;
}

const ChatTop = ({
	selectedFriend,
	setSelectedFriend,
	setBlock,
	block,
}: ChatTopProps) => {
	const [openMenu, setOpenMenu] = useState(false);
	const closeMenuRef = useRef<HTMLDivElement>(null);
	const buttonMenuRef = useRef<HTMLDivElement>(null);
	const { setMessages, setChats } = useChatContext();
	const user = getUser();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				closeMenuRef.current &&
				!closeMenuRef.current.contains(event.target as Node) &&
				buttonMenuRef.current &&
				!buttonMenuRef.current.contains(event.target as Node)
			) {
				setOpenMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleDeleteChat = async () => {
		try {
			await axios.delete(
				getendpoint("http", `/api/chat/chatuser/${selectedFriend.id}`),
				// `http://0.0.0.0:8000/api/chat/chats/?id=${chatId}`,
				{
					withCredentials: true,
				}
			);
			setChats((prevChats) => prevChats.filter((chat) => chat.id !== selectedFriend.id));
		} catch (err) {
			console.log("Error in fetching chats", err);
		}
		setMessages([]);
		setSelectedFriend(null);
		setOpenMenu(false);
	};

	const handleBlock = () => {
		setBlock(!block);
		setOpenMenu(false);
	};

	const friend_user =
		user?.id === selectedFriend.user2.id
			? selectedFriend.user1
			: selectedFriend.user2;
	return (
		<div className="top">
			<div className="profileInfo">
				<i
					className="fa-solid fa-arrow-left arrowClose"
					onClick={() => setSelectedFriend(null)}
				></i>
				<img src={friend_user.avatar} alt="profile" className="image" />
				<div className="textInfo">
					<span>{friend_user.username}</span>
					<p>Last seen today 00:56</p>
				</div>
			</div>
			<div ref={buttonMenuRef}>
				<i
					className={`fa-solid fa-ellipsis-vertical icon-menu ${
						openMenu ? "activeMenu" : ""
					}`}
					ref={closeMenuRef}
					onClick={() => setOpenMenu(!openMenu)}
				></i>
				{openMenu && (
					<ul className="menu-list">
						<li>Invite to play</li>
						<li onClick={handleDeleteChat}>Delete chat</li>
						<li onClick={() => setSelectedFriend(null)}>Close chat</li>
						<li onClick={handleBlock}>{!block ? "Block" : "Unblock"}</li>
					</ul>
				)}
			</div>
		</div>
	);
};

export default ChatTop;
