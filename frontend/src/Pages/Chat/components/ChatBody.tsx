import { useEffect, useRef, useState } from "react";
import "./ChatBody.css";
import ChatTop from "./ChatTop";
import ChatCenter from "./ChatCenter";
import ChatBottom from "./ChatBottom";
// import moment from "moment";
import axios from "axios";
import {
	getContext,
	getUser,
	getendpoint,
} from "../../../context/getContextData";
import {
	useChatContext,
	GetChats,
	ChatMessage,
} from "./context/ChatUseContext";
import Alert from "../../../components/Alert/Alert";

interface ChatBodyProps {
	selectedFriend: GetChats;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetChats | null>>;
}

const ChatBody = ({ selectedFriend, setSelectedFriend }: ChatBodyProps) => {
	const ref = useRef<HTMLTextAreaElement>(null);
	const { setBlock, clearMessages } = useChatContext();
	const user = getUser();
	const [messagesUser, setMessagesUser] = useState<ChatMessage[]>([]);
	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", `/api/chat/chatuser/${selectedFriend.id}`),
					{
						withCredentials: true,
					}
				);
				setMessagesUser(response.data.messages);
			} catch (err) {
				console.log("Error in fetching chats", err);
			}
		};
		
		if (selectedFriend) {
			clearMessages();
			fetchMessages();
		}

		const fetchBlockedFriend = async () => {
			let friend_id;
			if (user?.id === selectedFriend.user1.id) {
				friend_id = selectedFriend.user2.id;
			} else {
				friend_id = selectedFriend.user1.id;
			}
			try {
				const response = await axios.get(
					getendpoint("http", `/api/friends/blockedfriend/${friend_id}`),
					{
						withCredentials: true,
					}
				);
				setBlock(response.data);
			} catch (err) {
				console.log("Error in fetching chats", err);
			}
		};
		
		fetchBlockedFriend();
	}, [selectedFriend]);
	
	// const account = getContext();
	return (
		<>
			{/* <Alert primaryColor="#00ff115a" secondaryColor="#90f18b">
				<i className="fa-solid fa-circle-check"></i>
				<span>{account?.createdAlert}</span>
			</Alert> */}
			<div className="chatContent">
				<ChatTop
					selectedFriend={selectedFriend}
					setSelectedFriend={setSelectedFriend}
				/>
				<ChatCenter
					selectedFriend={selectedFriend}
					messagesUser={messagesUser}
				/>
				<ChatBottom selectedFriend={selectedFriend} ref={ref} />
			</div>
		</>
	);
};

export default ChatBody;
