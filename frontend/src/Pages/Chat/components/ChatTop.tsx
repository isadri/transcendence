import "./ChatTop.css";
import { useEffect, useRef, useState } from "react";
import { useChatContext, GetChats } from "./context/ChatUseContext";
import { getUser, getendpoint } from "../../../context/getContextData";
import axios from "axios";

interface ChatTopProps {
	selectedFriend: GetChats;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetChats | null>>;
}

const ChatTop = ({
	selectedFriend,
	setSelectedFriend,
}: ChatTopProps) => {
	const [openMenu, setOpenMenu] = useState(false);
	const closeMenuRef = useRef<HTMLDivElement>(null);
	const buttonMenuRef = useRef<HTMLDivElement>(null);
	const { block, blockUnblockFriend, activeChat } = useChatContext();
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

	// const handleDeleteChat = async () => {
	// 	try {
	// 		await axios.delete(
	// 			getendpoint("http", `/api/chat/chatuser/${selectedFriend.id}`),
	// 			// `http://0.0.0.0:8000/api/chat/chats/?id=${chatId}`,
	// 			{
	// 				withCredentials: true,
	// 			}
	// 		);
	// 		setChats((prevChats) =>
	// 			prevChats.filter((chat) => chat.id !== selectedFriend.id)
	// 		);
	// 		deleteChat({ chatId: selectedFriend.id, message_type: MessageType.DeleteChat})
	// 		setMessages((prevMessages) => prevMessages.filter((msg) => msg.chat !== selectedFriend.id));
	// 		setSelectedFriend(null);
	// 		setOpenMenu(false);
	// 	} catch (err) {
	// 		console.log("Error in fetching chats", err);
	// 	}
	// };

	const handleBlock = async () => {
		if (!user) return;
		let friend_id;
		if (user?.id === selectedFriend.user1.id) {
			friend_id = selectedFriend.user2.id;
		} else {
			friend_id = selectedFriend.user1.id;
		}
		try {
			if (block?.status) {
				await axios.post(
					getendpoint("http", `/api/friends/unblock/${friend_id}`),
					null,
					{
						withCredentials: true,
					}
				);
				blockUnblockFriend({
					chatid: selectedFriend.id,
					blocker: user?.id,
					blocked: friend_id,
					status: false,
				});
			} else {
				await axios.post(
					getendpoint("http", `/api/friends/block/${friend_id}`),
					null,
					{
						withCredentials: true,
					}
				);
				blockUnblockFriend({
					chatid: selectedFriend.id,
					blocker: user?.id,
					blocked: friend_id,
					status: true,
				});
			}
			setOpenMenu(false);
		} catch (err) {
			console.log("Error in handling block/unblock: ", err);
		}
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
					onClick={() => {
						setSelectedFriend(null)
						activeChat({chatid: -1})
					}}
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
						<li >Friend profile</li>
						{/* <li onClick={handleDeleteChat}>Delete chat</li> */}
						<li onClick={() => {
							setSelectedFriend(null)
							activeChat({chatid: -1})
							}}>Close chat</li>
						{block?.status && block.blocker === user?.id ? (
							<li onClick={handleBlock}>Unblock</li>
						) : (
							!block?.status && <li onClick={handleBlock}>Block</li>
						)}

					</ul>
				)}
			</div>
		</div>
	);
};

export default ChatTop;
