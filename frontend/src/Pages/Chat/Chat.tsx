import { useState, useEffect } from "react";
import "./Chat.css";
import ChatBody from "./components/ChatBody";
import ListChat from "./components/List";
import { Friend, Message } from "../Chat/components/types";
import DataFriends from "./components/DataFriends";
import DataMessage from "./components/DataMessage";
import moment from "moment";
import { useMediaQuery } from "@uidotdev/usehooks"; // npm i @uidotdev/usehooks

const Chat = () => {
	const isSmallDevice = useMediaQuery("only screen and (max-width : 478px)");
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
			const updatedMessage: Message = {
				senderId: 2,
				receiverId: 1,
				profile: "/images/wallpaper.jpeg",
				message: newMessage.message,
				time: moment().format("LT"),
			};
			setMessages((prevMessages) => [...prevMessages, updatedMessage]);
		}
	};

	return (
		<div className="Chat">
			{isSmallDevice ? (
				!selectedFriend && (
					<div className="List">
						<ListChat
							friends={DataFriends}
							onSelectFriend={handleSelectFriend}
							selectedFriend={selectedFriend}
						/>
					</div>
				)
			) : (
				<div className="List">
					<ListChat
						friends={DataFriends}
						onSelectFriend={handleSelectFriend}
						selectedFriend={selectedFriend}
					/>
				</div>
			)}
			{isSmallDevice ? (
				<div className={`Messages ${selectedFriend ? "" : "inactive"}`}>
					{selectedFriend ? (
						<ChatBody
							selectedFriend={selectedFriend}
							messages={messages}
							onSendMessage={handleSendMessage}
							setSelectedFriend={setSelectedFriend}
							setMessages={setMessages}
						/>
					) : (
						<div></div>
					)}
				</div>
			) : (
				<div className="Messages">
					{selectedFriend ? (
						<ChatBody
							selectedFriend={selectedFriend}
							messages={messages}
							onSendMessage={handleSendMessage}
							setSelectedFriend={setSelectedFriend}
							setMessages={setMessages}
						/>
					) : (
						<div className="backgroundOfChat">
							<img
								src="./ChatImages/backgroundOfChat.svg"
								alt="backgroundOfChat"
							/>
							<span>Welcome to Chat!</span>
							<p>
								Please select a friend from your contacts list to start a
								conversation. We're here when you're ready to chat!
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Chat;
