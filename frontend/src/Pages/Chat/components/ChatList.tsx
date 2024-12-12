import { useEffect, useMemo } from "react";
import "./ChatList.css";
import axios from "axios";
import { getUser, getendpoint } from "../../../context/getContextData";
import { useChatContext, GetFriends, GetChats } from "./context/ChatUseContext";

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
	// const { lastMessage, setChats, chats, activeChat } = useChatContext();
	const { lastMessage, setChats, chats, activeChat, unseenMessage, unseen } = useChatContext();

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
	}, [unseen]);

	const handleAddConversationRequests = async (id: number) => {
		const existingChat = chats.find(
			(chat) => chat.user1.id === id || chat.user2.id === id
		);

		if (existingChat) {
			onSelectFriend(existingChat);
			activeChat({chatid: existingChat.id})
			unseenMessage({chatid: existingChat.id})
			return;
		}
		try {
			const response = await axios.post(
				getendpoint("http", "/api/chat/chats/"),
				{ user2: id },
				{ withCredentials: true }
			);
			
			setChats((prevChats) => [...prevChats, response.data]);
			onSelectFriend(response.data);
			activeChat({chatid: response.data.id})
			unseenMessage({chatid: response.data.id})
		} catch (error) {
			console.error("Error creating conversation:", error);
		}
	};

	const getLastMessage = (chat: GetChats): string | null => {
		const lastMsg = lastMessage[chat.id];
		if (!lastMsg) return chat.last_message;
		return lastMsg.content;
	};

	const formatTimes = (time: string | null): string => {
		if (!time) return "";
		return Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(new Date(time));
	};

	const getLastMessageTime = (chat: GetChats): string | null => {
		const lastMsg = lastMessage[chat.id];
		const lastMessag = lastMsg || chat.messages[chat.messages.length - 1];
	
		if (!lastMessag || !lastMessag.timestamp) {
			console.warn("Invalid or missing timestamp for chat:", chat.id);
			return null;
		}
	
		const lastMessageTime = new Date(lastMessag.timestamp).getTime();
	
		if (isNaN(lastMessageTime)) {
			console.error("Invalid timestamp value:", lastMessag.timestamp);
			return null;
		}
	
		const now = Date.now();
		const diffInSeconds = Math.floor((now - lastMessageTime) / 1000);
		const diffInDays = Math.floor(diffInSeconds / 86400);
	
		if (diffInDays < 1)
			return formatTimes(lastMessag.timestamp)
		if (diffInDays == 1)
			return "Yesterday"
		return Intl.DateTimeFormat("en-US", {
			year: "2-digit",
			month: "2-digit",
			day: "2-digit",
		}).format(new Date(lastMessag.timestamp))
	};

	// Sort chats by the most recent message timestamp
	const sortedChats = useMemo(() => {
		return chats
			.map((chat) => {
				const lastMsg = lastMessage[chat.id];
				return {
					...chat,
					last_message: lastMsg?.content || chat.last_message,
					last_timestamp: lastMsg?.timestamp || chat.created_at,
				};
			})
			.filter((chat) => chat.messages.length > 0)
			.sort(
				(a, b) =>
					new Date(b.last_timestamp || "").getTime() -
					new Date(a.last_timestamp || "").getTime()
			);
	}, [chats, lastMessage]);
	if (!sortedChats) {
		return null;
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
										activeChat({chatid: newChat.id})
										unseenMessage({chatid: newChat.id})
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
				  : sortedChats &&
				  sortedChats.map((chat) => {
						const friend_user =
							user?.id === chat.user2.id ? chat.user1 : chat.user2;
							if (!friend_user) return null;
							const lastMessageContent = getLastMessage(chat);
							const lastMessageTime = getLastMessageTime(chat);
						const notificate =
							user?.id === chat.user2.id ? chat.nbr_of_unseen_msg_user2 : chat.nbr_of_unseen_msg_user1;
						return (
							<div
								className={`item ${
									selectedFriend?.id === chat.id ? "selected" : ""
								}`}
								key={chat.id}
								onClick={() => {
									onSelectFriend(chat);
									activeChat({chatid: chat.id})
									unseenMessage({chatid: chat.id})
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
										<div>{lastMessageTime}</div>
										{notificate && <div className="notificationMessage">{notificate}</div>}
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
