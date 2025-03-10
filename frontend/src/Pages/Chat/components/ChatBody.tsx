import { useEffect, useRef, useState } from "react";
import "./ChatBody.css";
import ChatTop from "./ChatTop";
import ChatCenter from "./ChatCenter";
import ChatBottom from "./ChatBottom";
import axios from "axios";
import {
	getUser,
	getendpoint,
} from "../../../context/getContextData";
import {
	useChatContext,
	GetChats,
	ChatMessage,
} from "./context/ChatUseContext";
import Preloader from "../../Preloader/Preloader";

interface ChatBodyProps {
	selectedFriend: GetChats;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetChats | null>>;
}

const ChatBody = ({ selectedFriend, setSelectedFriend }: ChatBodyProps) => {
	const ref = useRef<HTMLTextAreaElement>(null);
	const { setBlock, clearMessages } = useChatContext();
	const user = getUser();
	const [messagesUser, setMessagesUser] = useState<ChatMessage[]|null>(null);
	useEffect(() => {
		const fetchMessages = async () => {
			try {
				setMessagesUser(null)
				const response = await axios.get(
					getendpoint("http", `/api/chat/chatuser/${selectedFriend.id}`),
					{
						withCredentials: true,
					}
				);
				setMessagesUser(response.data.messages);
			} catch (err) {
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
			}
		};
		
		fetchBlockedFriend();
	}, [selectedFriend]);
	if (!messagesUser)
		return <><Preloader/></>

	return (
		<>
			<div className="chatContent">
				<ChatTop
					selectedFriend={selectedFriend}
					setSelectedFriend={setSelectedFriend}
				/>
				<ChatCenter
					selectedFriend={selectedFriend}
					messagesUser={messagesUser}
				/>
				<ChatBottom selectedFriend={selectedFriend} ref={ref} setSelectedFriend={setSelectedFriend} />
			</div>
		</>
	);
};

export default ChatBody;
