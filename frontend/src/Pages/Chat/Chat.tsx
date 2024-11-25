import { useState, useEffect } from "react";
import "./Chat.css";
import ChatBody from "./components/ChatBody";
import ListChat from "./components/List";
import moment from "moment";
import { useMediaQuery } from "@uidotdev/usehooks"; // npm i @uidotdev/usehooks
import axios from "axios";

// import { Friend, Message } from "../Chat/components/types";
// import DataFriends from "./components/DataFriends";
// import DataMessage from "./components/DataMessage";

export interface GetFriends {
	id: number;
	username: string;
	avatar: string;
}

export interface FriendsMessages {
	id: number;
    chat: number;
    sender: number;
    content: string;
    timestamp: string
    file: string
    image: string
}


const Chat = () => {
	const isSmallDevice = useMediaQuery("only screen and (max-width : 478px)");
	const [selectedFriend, setSelectedFriend] = useState<GetFriends | null>(null);
	const [messages, setMessages] = useState<FriendsMessages[]>([]);

	const [getFriends, setGetFriends] = useState<GetFriends[]>([])

	useEffect(() => {
		// if (selectedFriend) {
		// 	setMessages(DataMessage[selectedFriend.name] || []);
		// }

		const fetchFriend = () => {
			axios.get("http://0.0.0.0:8000/api/friends/friends", {
				withCredentials: true, // Include cookies in the request
			})
			.then(response => {
				setGetFriends(response.data.friends)
				// console.log(response.data.friends)
			})
			.catch(err => {
					console.log(err.data); // Set the response data to state
			  });
		}

		const fetchMessages = (chatId: number) => {
			axios.get(`http://0.0.0.0:8000/api/chats/chats/?user2=${chatId}`, {
				withCredentials: true, // Include cookies in the request
			})
			.then(response => {
				setMessages(response.data.messages)
				// console.log(response.data.friends)
			})
			.catch(err => {
					console.log(err.data); // Set the response data to state
			  });
		}

		fetchFriend()
		if (selectedFriend) {
			const chatId = selectedFriend.id
			fetchMessages(chatId)
		}
		
	}, [selectedFriend]);

	const handleSelectFriend = (friend: GetFriends) => {
		setSelectedFriend(friend);
	};
	
	const handleSendMessage = (newMessage: string) => {
		if (selectedFriend) {
			const chatId = selectedFriend.id
			axios.post("http://0.0.0.0:8000/api/chats/messages/", {chat: chatId, content: newMessage}, {
				withCredentials: true, // Include cookies in the request
			})
			.then(response => {
				setMessages((prevMessages) => [...prevMessages, response.data]);
				// console.log(response.data.friends)
			})
			.catch(err => {
					console.log(err.data); // Set the response data to state
			});
			// const updatedMessage: Message = {
			// 	senderId: 2,
			// 	receiverId: 1,
			// 	profile: "/images/wallpaper.jpeg",
			// 	message: newMessage.message,
			// 	time: moment().format("LT"),
			// };
			// setMessages((prevMessages) => [...prevMessages, updatedMessage]);
		}
	};

	return (
		<div className="Chat">
			{isSmallDevice ? (
				!selectedFriend && (
					<div className="Chat-List">
						<ListChat
							friends={getFriends}
							onSelectFriend={handleSelectFriend}
							selectedFriend={selectedFriend}
						/>
					</div>
				)
			) : (
				<div className="Chat-List">
					<ListChat
						friends={getFriends}
						onSelectFriend={handleSelectFriend}
						selectedFriend={selectedFriend}
					/>
				</div>
			)}
			{/* {isSmallDevice ? (
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
			) : ( */}
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
			{/* )} */}
		</div>
	);
};

export default Chat;
