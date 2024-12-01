import { useEffect, useRef, useState } from "react";
import "./ChatBody.css";
import ChatTop from "./ChatTop";
import ChatCenter from "./ChatCenter";
import ChatBottom from "./ChatBottom";
import moment from "moment";
import { GetFriends } from "../Chat";
import { GetChats, ChatMessage } from "./ChatList";
import axios from "axios";
import { getendpoint } from "../../../context/getContextData";

interface ChatBodyProps {
	selectedFriend: GetChats;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetChats | null>>;
}

const ChatBody = ({ selectedFriend, setSelectedFriend }: ChatBodyProps) => {
	const ref = useRef<HTMLInputElement>(null);
	const [block, setBlock] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	useEffect(() => {
		const fetchMessages = async (chatId: number) => {
			try {
				const response = await axios.get(
					getendpoint("http", `/api/chat/chats/?id=${chatId}`),
					// `http://0.0.0.0:8000/api/chat/chats/?id=${chatId}`,
					{
						withCredentials: true,
					}
				);
				setMessages(response.data.messages);
			} catch (err) {
				console.log("Error in fetching chats", err);
			}
		};

		if (selectedFriend) {
			const chatId = selectedFriend.id;
			fetchMessages(chatId);
		}
	}, [selectedFriend]);

	return (
		<div className="chatContent">
			<ChatTop
				selectedFriend={selectedFriend}
				setSelectedFriend={setSelectedFriend}
				setMessages={setMessages}
				setBlock={setBlock}
				block={block}
			/>
			<ChatCenter messages={messages} selectedFriend={selectedFriend} />
			<ChatBottom
				selectedFriend={selectedFriend}
				setMessages={setMessages}
				ref={ref}
				block={block}
			/>
		</div>
	);
};

export default ChatBody;
