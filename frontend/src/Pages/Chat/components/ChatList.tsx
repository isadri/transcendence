import { useEffect, useState } from "react";
import { GetFriends } from "../Chat";
import "./ChatList.css";
import axios from "axios";
import { getendpoint } from "../../../context/getContextData";
import { ChatMessage } from "./context/ChatUseContext";

// export interface ChatMessage {
// 	id: number;
// 	chat: number;
// 	sender: number;
// 	content: string;
// 	timestamp: string;
// 	file: string | null;
// 	image: string | null;
// }

export interface GetChats {
	id: number;
	user1: GetFriends;
	user2: GetFriends;
	created_at: string;
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
		const existingChat = chats.find((chat) => chat.user2.id === id);

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
			// console.log(response.data);
		} catch (error) {
			console.error("Error creating conversation:", error);
		}
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
				: chats.map((chat) => (
						<div
							className={`item ${
								selectedFriend?.id === chat.id ? "selected" : ""
							}`}
							key={chat.user2.id}
							onClick={() => {
								onSelectFriend(chat);
								setSearchFriend("");
								setFocusOnSearch(false);
								setListAllFriends(false);
							}}
						>
							<img src={chat.user2.avatar} alt="profile" className="profile" />
							<div className="text">
								<span>{chat.user2.username}</span>
								{/* {!listAllFriends && <p>{chat.message}</p>} */}
							</div>
							{chat.messages.length > 0 && (
								<p>{chat.messages[chat.messages.length - 1].content}</p>
							)}
							{/* {!listAllFriends && <div className="ChatStatus">
								<div>{friend.time}</div>
								{friend.status}
							</div>} */}
						</div>
				  ))}
		</div>
	);
};

export default ChatList;
