import { useState } from "react";
import "./ChatBody.css";
import profile from "./images/profile.jpeg";
import DataMessage from "./DataMessage";
import ChatTop from "./ChatTop";
import ChatCenter from "./ChatCenter";
import ChatBottom from "./ChatBottom";

interface Message {
	message: string;
	senderId: number;
	receverId: number;
	time: string;
	image?: string;
	profile?: string;
}

const ChatBody = () => {
	const [text, setText] = useState("");
	const [messages, setMessages] = useState<Message[]>(DataMessage);

	const handleSend = () => {
		if (text.trim()) {
			const newMessage = {
				message: text,
				senderId: 2,
				receverId: 1,
				time: "Just now",
				image: "",
				profile,
			};
			setMessages((prev) => [...prev, newMessage]);
			setText("");
		}
	};

	return (
		<div className="chatContent">
			<ChatTop />
			<ChatCenter messages={messages} />
			<ChatBottom text={text} setText={setText} handleSend={handleSend} />
		</div>
	);
};

export default ChatBody;
