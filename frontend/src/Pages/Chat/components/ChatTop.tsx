import { Friend } from "./types";
import "./ChatTop.css";
import { useState } from "react";

interface ChatTopProps {
	selectedFriend: Friend;
}

const ChatTop = ({ selectedFriend }: ChatTopProps) => {
	const [openMenu, setOpenMenu] = useState(false);

	return (
		<div className="top">
			<div className="profileInfo">
				<img src={selectedFriend.profile} alt="profile" className="image" />
				<div className="textInfo">
					<span>{selectedFriend.name}</span>
					<p>Last seen today 00:56</p>
				</div>
			</div>
			<i
				className={`fa-solid fa-ellipsis-vertical icon-menu ${openMenu ? "activeMenu" : ""}`}
				onClick={() => setOpenMenu(!openMenu)}
			></i>
			{openMenu && (
				<ul className="menu-list">
					<li>Invite to play</li>
					<li>Delete chat</li>
					<li>Close chat</li>
					<li>Block</li>
				</ul>
			)}
		</div>
	);
};

export default ChatTop;
