import { useEffect, useState } from "react";
import { GetFriends } from "../Chat";
import "./ChatList.css";
import axios from "axios";
import { getUser, getendpoint } from "../../../context/getContextData";
import { ChatMessage, useChatContext } from "./context/ChatUseContext";
import { log } from "three/webgpu";

export interface GetChats {
	id: number;
	user1: GetFriends;
	user2: GetFriends;
	created_at: string;
	last_message: string | null;
	messages: ChatMessage[];
}

interface ChatListProps {
	friends: GetFriends[];
	onSelectFriend: (friend: GetChats) => void;
	selectedFriend: GetChats | null;
	setSearchFriend: React.Dispatch<React.SetStateAction<string>>;
	setFocusOnSearch: React.Dispatch<React.SetStateAction<boolean>>;
	listAllFriends: boolean;
	setListAllFriends: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatList = ({
	friends,
	onSelectFriend,
	selectedFriend,
	setSearchFriend,
	setFocusOnSearch,
	listAllFriends,
	setListAllFriends,
}: ChatListProps) => {
	const [chats, setChats] = useState<GetChats[]>([]);
	const user = getUser();
	const { lastMessage } = useChatContext();

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", "/api/chat/chats/"),
					// "http://0.0.0.0:8000/api/chat/chats/",
					{
						withCredentials: true, // Include cookies in the request
					}
				);
				setChats(response.data);
			} catch (err) {
				console.log(err); // Set the response data to state
			}
		};

		fetchChats();
	}, []);

	const handleAddConversationRequests = async (id: number) => {
		const existingChat = chats.find(
			(chat) => chat.user1.id === id || chat.user2.id === id
		);

		if (existingChat) {
			onSelectFriend(existingChat);
			return;
		}
		try {
			const response = await axios.post(
				getendpoint("http", "/api/chat/chats/"),
				// "http://0.0.0.0:8000/api/chat/chats/",
				{ user2: id },
				{ withCredentials: true }
			);

			setChats((prevChats) => [...prevChats, response.data]);
			onSelectFriend(response.data);
		} catch (error) {
			console.error("Error creating conversation:", error);
		}
	};

	const getLastMessage = (chat: GetChats): string | null => {
		// Return the last message from the lastMessages object for the specific chat
		return lastMessage[chat.id] || chat.last_message || "No messages yet";
	};
	  

	return (
		<div className="ChatList">
			{listAllFriends
				? friends.map((friend) => (
						<div
							className={`item ${
								selectedFriend?.id === friend.id ? "selected" : ""
							}`}
							key={friend.id}
							onClick={() => {
								handleAddConversationRequests(friend.id).then(() => {
									const newChat = chats.find(
										(chat) => chat.user2.id === friend.id
									);
									if (newChat) {
										onSelectFriend(newChat);
									}
								});
								setSearchFriend("");
								setFocusOnSearch(false);
								setListAllFriends(false);
							}}
						>
							<img src={friend.avatar} alt="profile" className="profile" />
							<div className="text">
								<span>{friend.username}</span>
							</div>
						</div>
				  ))
				: chats.map((chat) => {
						const friend_user =
							user?.id === chat.user2.id ? chat.user1 : chat.user2;
						const lastMessageContent = getLastMessage(chat);
						return (
							<div
								className={`item ${
									selectedFriend?.id === chat.id ? "selected" : ""
								}`}
								key={friend_user.id}
								onClick={() => {
									onSelectFriend(chat);
									setSearchFriend("");
									setFocusOnSearch(false);
									setListAllFriends(false);
								}}
							>
								<img
									src={friend_user.avatar}
									alt="profile"
									className="profile"
								/>
								<div className="text">
									<span>{friend_user.username}</span>
									{!listAllFriends && <p>{lastMessageContent || ""}</p>}
								</div>
								{/* {!listAllFriends && <div className="ChatStatus">
								<div>{friend.time}</div>
								{friend.status}
							</div>} */}
							</div>
						);
				  })}
		</div>
	);
};

export default ChatList;
