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
}

const ChatBody = ({
	selectedFriend,
	messages,
	onSendMessage,
	setSelectedFriend,
}: ChatBodyProps) => {
	const [text, setText] = useState("");
	const ref = useRef<HTMLInputElement>(null);

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
			<ChatTop selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />
			<ChatCenter messages={messages} />
			<ChatBottom
				text={text}
				setText={setText}
				handleSend={handleSend}
				ref={ref}
			/>
		</div>
	);
};

export default ChatBody;
