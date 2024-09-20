import { Friend, Message } from "./types";
import "./ChatTop.css";
import { useEffect, useRef, useState } from "react";

interface ChatTopProps {
	selectedFriend: Friend;
	setSelectedFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	setBlock: React.Dispatch<React.SetStateAction<boolean>>;
	block: boolean;
}

const ChatTop = ({
	selectedFriend,
	setSelectedFriend,
	setMessages,
	setBlock,
	block,
}: ChatTopProps) => {
	const [openMenu, setOpenMenu] = useState(false);
	const closeMenuRef = useRef<HTMLDivElement>(null);
	const buttonMenuRef = useRef<HTMLDivElement>(null);

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

	const handleDeleteChat = () => {
		setMessages([]);
		setOpenMenu(false);
	};

	const handleBlock = () => {
		setBlock(!block);
		setOpenMenu(false);
	};

	return (
		<div className="top">
			<div className="profileInfo">
				<img src={selectedFriend.profile} alt="profile" className="image" />
				<div className="textInfo">
					<span>{selectedFriend.name}</span>
					<p>Last seen today 00:56</p>
				</div>
			</div>
			<div  ref={buttonMenuRef}>
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
