import { useRef, useState } from "react";
import "./ChatBody.css";
import ChatTop from "./ChatTop";
import ChatCenter from "./ChatCenter";
import ChatBottom from "./ChatBottom";
import moment from "moment";
import { Friend, Message } from "./types";

interface ChatBodyProps {
	selectedFriend: Friend;
	messages: Message[];
	onSendMessage: (message: Message) => void;
	setSelectedFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBody = ({
	selectedFriend,
	messages,
	onSendMessage,
	setSelectedFriend,
	setMessages,
}: ChatBodyProps) => {
	const [text, setText] = useState("");
	const ref = useRef<HTMLInputElement>(null);
	const [block, setBlock] = useState(false);

	const handleSend = () => {
		if (text.trim()) {
			const newMessage: Message = {
				message: text,
				senderId: 2,
				receiverId: selectedFriend.id,
				time: moment().format("LT"),
			};
			onSendMessage(newMessage);
			setText("");
		}
	};

	return (
		<div className="chatContent">
			<ChatTop
				selectedFriend={selectedFriend}
				setSelectedFriend={setSelectedFriend}
				setMessages={setMessages}
				setBlock={setBlock}
				block={block}
			/>
			<ChatCenter messages={messages} />
			<ChatBottom
				text={text}
				setText={setText}
				handleSend={handleSend}
				ref={ref}
				block={block}
			/>
		</div>
	);
};

export default ChatBody;
