import { useEffect, useState } from "react";
import { GetFriends } from "../Chat";
import "./ChatList.css";
import axios from "axios";
// import { Friend } from "./types";

export interface ChatMessage {
	id: number;
	chat: number;
	sender: number;
	content: string;
	timestamp: string;
	file: string | null;
	image: string | null;
}

export interface GetChats {
	id: number;
	user1: number;
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
		const fetchChats = () => {
			axios
				.get("http://0.0.0.0:8000/api/chat/chats/", {
					withCredentials: true, // Include cookies in the request
				})
				.then((response) => {
					setChats(response.data);
					// console.log(response.data.friends)
				})
				.catch((err) => {
					console.log(err.data); // Set the response data to state
				});
		};

		fetchChats();
	}, []);

	const handleAddConversationRequests = (id: number) => {
		axios
			.post(
				"http://0.0.0.0:8000/api/chat/chats/",
				{ user2: id },
				{
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log(response.data);
				// need to add this to the conversation
				// setAllUsers((prev) =>
				// 	prev.filter((request) => request.id !== id)
				// );
			})
			.catch((error) => {
				console.error("Error accepting friend request:", error);
			});
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
								handleAddConversationRequests(friend.id);
								onSelectFriend(friend);
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
