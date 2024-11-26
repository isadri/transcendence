import { useEffect, useRef, useState } from "react";
import "./ChatBody.css";
import ChatTop from "./ChatTop";
import ChatCenter from "./ChatCenter";
import ChatBottom from "./ChatBottom";
import moment from "moment";
import { GetFriends } from "../Chat";
import { GetChats, ChatMessage } from "./ChatList";
import axios from "axios";
// import { Friend, Message } from "./types";


interface ChatBodyProps {
	selectedFriend: GetChats;
	// onSendMessage: (message: string) => void;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetChats | null>>;
}

const ChatBody = ({
	selectedFriend,
	// onSendMessage,
	setSelectedFriend,
}: ChatBodyProps) => {
	// const [text, setText] = useState("");
	const ref = useRef<HTMLInputElement>(null);
	const [block, setBlock] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	useEffect(() => {
		// if (selectedFriend) {
		// 	setMessages(DataMessage[selectedFriend.name] || []);
		// }

		const fetchMessages = (chatId: number) => {
			axios
				.get(`http://0.0.0.0:8000/api/chat/chats/?id=${chatId}`, {
					withCredentials: true, // Include cookies in the request
				})
				.then((response) => {
					setMessages(response.data.messages);
					// console.log(response.data.friends)
				})
				.catch((err) => {
					console.log(err.data); // Set the response data to state
				});
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
				// text={text}
				// setText={setText}
				// handleSend={handleSend}
				selectedFriend={selectedFriend}
				setMessages={setMessages}
				ref={ref}
				block={block}
			/>
		</div>
	);
};

export default ChatBody;
