import { useRef, useState } from "react";
import "./ChatBody.css";
import profile from "../images/profile.jpeg";
import DataMessage from "./DataMessage";
import ChatTop from "./ChatTop";
import ChatCenter from "./ChatCenter";
import ChatBottom from "./ChatBottom";
import moment from "moment";

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
	const ref = useRef<HTMLInputElement>(null);
	const handleSend = () => {
		if (text.trim()) {
			const newMessage = {
				message: text,
				senderId: 2,
				receverId: 1,
				time: moment().format('LT'), // npm install moment --save
				image: "",
				profile,
			};
			if (ref.current) ref.current.focus();
			setMessages((prev) => [...prev, newMessage]);
			setText("");
		}
	};

	return (
		<div className="chatContent">
			<ChatTop />
			<ChatCenter messages={messages} />
			<ChatBottom text={text} setText={setText} handleSend={handleSend} ref={ref}/>
		</div>
	);
};

export default ChatBody;
