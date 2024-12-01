import { forwardRef, useEffect, useRef, useState } from "react";
import "./ChatBottom.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { GetChats, ChatMessage } from "./ChatList";
import axios from "axios";
import { getendpoint } from "../../../context/getContextData";

interface ChatBottomProps {
	selectedFriend: GetChats;
	setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
	block: boolean;
}

const ChatBottom = forwardRef<HTMLInputElement, ChatBottomProps>(
	({ block, setMessages, selectedFriend }, ref) => {
		const [open, setOpen] = useState(false);
		const closeEmoji = useRef<HTMLDivElement>(null);
		const buttonRef = useRef<HTMLDivElement>(null);
		const [text, setText] = useState("");

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					closeEmoji.current &&
					!closeEmoji.current.contains(event.target as Node) &&
					buttonRef.current &&
					!buttonRef.current.contains(event.target as Node)
				) {
					setOpen(false);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);

			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, []);

		const handleSendMessage = async (newMessage: string) => {
			if (selectedFriend && newMessage.trim()) {
				const chatId = selectedFriend.id;
				try {
					const response = await axios.post(
						getendpoint("http", "/api/chat/messages/"),
						// "http://0.0.0.0:8000/api/chat/messages/",
						{ chat: chatId, content: newMessage },
						{
							withCredentials: true,
						}
					);
					setMessages((prevMessages) => [
						...(prevMessages || []),
						response.data,
					]);
					setText("");
				} catch (err) {
					console.error("Error sending message:", err);
				}
			}
		};

		const handleEmojiClick = (emojiObject: EmojiClickData) => {
			setText((prev) => prev + emojiObject.emoji);
			if (ref && "current" in ref && ref.current) {
				ref.current.focus();
			}
		};

		const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				event.preventDefault();
				handleSendMessage(text);
				setText("");
				setOpen(false);
			}
		};

		return (
			<div className="bottom">
				{!block ? (
					<>
						<div className="emoji" ref={buttonRef}>
							<i
								className="fa-solid fa-face-smile emoji-icon"
								onClick={() => setOpen((prev) => !prev)}
							></i>
							<div className="picker" ref={closeEmoji}>
								{open && <EmojiPicker onEmojiClick={handleEmojiClick} />}
							</div>
						</div>
						<div className="messageContent">
							<i className="fa-solid fa-paperclip partage-icon"></i>
							<input
								type="text"
								placeholder="Type a message..."
								disabled={block}
								value={text}
								onChange={(event) => setText(event.target.value)}
								onKeyDown={handleKeyDown}
								ref={ref}
							/>
						</div>
						<button
							className="subButton"
							onClick={() => handleSendMessage(text)}
						>
							<i className="fa-solid fa-paper-plane send-icon"></i>
						</button>
					</>
				) : (
					<div className="block">Can't send a message to blocked contact.</div>
				)}
			</div>
		);
	}
);

export default ChatBottom;
