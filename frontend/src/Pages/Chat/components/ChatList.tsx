import { useEffect } from "react";
// import { GetFriends } from "../Chat";
import "./ChatList.css";
import axios from "axios";
import { getUser, getendpoint } from "../../../context/getContextData";
import { useChatContext, GetFriends, GetChats } from "./context/ChatUseContext";

// export interface GetChats {
// 	id: number;
// 	user1: GetFriends;
// 	user2: GetFriends;
// 	created_at: string;
// 	last_message: string | null;
// 	messages: ChatMessage[];
// }

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
	const user = getUser();
	const { lastMessage, setChats, chats } = useChatContext();

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

		fetchChats()
	}, []);

	const handleAddConversationRequests = async (id: number) => {
		const existingChat = chats.find(
			(chat) => chat.user1.id === id || chat.user2.id === id
		);

		if (existingChat) {
			console.log("existing");
			
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
		const lastMsg = lastMessage[chat.id];
		if (!lastMsg) return chat.last_message;
		return lastMsg.content;
	};

	const getLastMessageTime = (chat: GetChats): string | null => {
		const lastMsg = lastMessage[chat.id];
		if (!lastMsg) return "";
		return lastMsg.timestamp;
	};

	const formatTimes = (time: string | null): string => {
		if (!time) return "";
		return Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(new Date(time));
	};

	// Sort chats by the most recent message timestamp
	const sortedChats = chats
	.map((chat) => {
		const lastMsg = lastMessage[chat.id];
		return {
			...chat,
			last_message: lastMsg?.content || chat.last_message,
			last_timestamp: lastMsg?.timestamp || chat.created_at,
		};
	})
	.filter(chat => chat.messages.length > 0)
	.sort(
		(a, b) =>
			new Date(b.last_timestamp || "").getTime() -
			new Date(a.last_timestamp || "").getTime()
	);
	if (!sortedChats) {
		return null
	} 

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
				: sortedChats && sortedChats.map((chat) => {
						const friend_user =
							user?.id === chat.user2.id ? chat.user1 : chat.user2;
						const lastMessageContent = getLastMessage(chat);
						const lastMessageTime = getLastMessageTime(chat);
						return (
							<div
								className={`item ${
									selectedFriend?.id === chat.id ? "selected" : ""
								}`}
								key={chat.id}
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
								{!listAllFriends && (
									<div className="ChatStatus">
										<div>{formatTimes(lastMessageTime)}</div>
										{/* {friend.status} */}
									</div>
								)}
							</div>
						);
				  })}
		</div>
	);
};

export default ChatList;
