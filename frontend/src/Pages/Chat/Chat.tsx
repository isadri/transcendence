import { useState, useEffect } from "react";
import "./Chat.css";
import ChatBody from "./components/ChatBody";
import ListChat from "./components/List";
import { Friend, Message } from "../Chat/components/types";
import DataFriends from "./components/DataFriends";
import DataMessage from "./components/DataMessage";
import moment from "moment";

const Chat = () => {
	const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (selectedFriend) {
			setMessages(DataMessage[selectedFriend.name] || []);
		}
	}, [selectedFriend]);

	const handleSelectFriend = (friend: Friend) => {
		setSelectedFriend(friend);
	};

	const handleSendMessage = (newMessage: Message) => {
		if (selectedFriend) {
			const updatedMessage : Message = {
				senderId: 2,
				receiverId: 1,
				profile: "/images/wallpaper.jpeg",
				message: newMessage.message,
				time: moment().format('LT'),
			};
			setMessages((prevMessages) => [...prevMessages, updatedMessage]);
		}
	};

	return (
		<div className="Chat">
			<div className="List">
				<ListChat
					friends={DataFriends}
					onSelectFriend={handleSelectFriend}
					selectedFriend={selectedFriend}
				/>
			</div>
			<div className="Messages">
				{selectedFriend ? (
					<ChatBody
						selectedFriend={selectedFriend}
						messages={messages}
						onSendMessage={handleSendMessage}
					/>
				) : (
					<div></div>
				)}
			</div>
		</div>
	);
};

export default Chat;
