import { useEffect, useRef, useState } from "react";
import "./ChatBody.css";
import profile from "./images/profile.jpeg";
import DataMessage from "./DataMessage";
import ChatTop from "./ChatTop";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"; //npm i emoji-picker-react

interface Message {
	message: string;
	senderId: number;
	receverId: number;
	time: string;
	image?: string;
	profile?: string;
}

const ChatBody = () => {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [messages, setMessages] = useState<Message[]>(DataMessage);

	const endRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleEmojiClick = (emojiObject: EmojiClickData) => {
		setText((prev) => prev + emojiObject.emoji);
		setOpen(false);
		if (inputRef.current) inputRef.current.focus();
	};

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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="chatContent">
			<ChatTop/>
			<div className="center">
				{messages.map((value, index) => {
					return (
						<div
							key={index}
							className={` ${
								value.senderId === 1 ? "message" : "message-own"
							} `}
						>
							{value.senderId === 1 && (
								<img src={value.profile} alt="profile" className="profile" />
							)}
							<div className="textMessage">
								{value.image !== "" && value.image !== undefined && (
									<img
										src={value.image}
										alt="imgPartage"
										className="imgPartage"
									/>
								)}
								<p>{value.message}</p>
								<span>{value.time}</span>
							</div>
						</div>
					);
				})}
				<div ref={endRef}></div>
			</div>
			<div className="bottom">
				<div className="emoji">
					<i
						className="fa-solid fa-face-smile emoji-icon"
						onClick={() => setOpen((prev) => !prev)}
					></i>
					<div className="picker">
						{open && <EmojiPicker onEmojiClick={handleEmojiClick} />}
					</div>
				</div>
				<div className="messageContent">
					<i className="fa-solid fa-paperclip partage-icon"></i>
					<input
						type="text"
						placeholder="Type a message..."
						value={text}
						onChange={(event) => setText(event.target.value)}
						onKeyDown={handleKeyDown}
						ref={inputRef}
					/>
				</div>
				<button className="subButton" onClick={handleSend}>
					<i className="fa-solid fa-paper-plane send-icon"></i>
				</button>
			</div>
		</div>
	);
};

export default ChatBody;
