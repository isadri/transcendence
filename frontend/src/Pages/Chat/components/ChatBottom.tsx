import { forwardRef, useEffect, useRef, useState } from "react";
import "./ChatBottom.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { GetChats } from "./ChatList";
// import axios from "axios";
// import { getUser, getendpoint } from "../../../context/getContextData";
import { ChatMessage, useChatContext } from "./context/ChatUseContext";

interface ChatBottomProps {
	selectedFriend: GetChats;
	// setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
	block: boolean;
}

const ChatBottom = forwardRef<HTMLInputElement, ChatBottomProps>(
	({ block, selectedFriend }, ref) => {
		const [open, setOpen] = useState(false);
		const closeEmoji = useRef<HTMLDivElement>(null);
		const buttonRef = useRef<HTMLDivElement>(null);
		const [text, setText] = useState("");
		const { setMessages, sendMessage } = useChatContext()

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

		const handleSendMessage = async () => {
			if (selectedFriend && text.trim()) {
				sendMessage({
					// message: text,
					message: text.trim(),
					sender: selectedFriend.user1.id,
					receiver: selectedFriend.user2.id,
				})
				console.log(text);
				
				const newMessage: ChatMessage = {
					id: Date.now(),
					chat: selectedFriend.id,
					sender: selectedFriend.user1.id,
					receiver: selectedFriend.user2.id,
					content: text.trim(),
					timestamp: new Date().toISOString(),
					file: null,
					image: null,

				}
				console.log("newMessages:", newMessage);
				setMessages((prev) => {
					console.log("Previous Messages:", prev);
					return [...prev, newMessage];
				});
				// setMessages((prev) => [...prev, newMessage])
				setText("");
				setOpen(false);
				// try {
				// 	const response = await axios.post(
				// 		getendpoint("http", "/api/chat/messages/"),
				// 		// "http://0.0.0.0:8000/api/chat/messages/",
				// 		{ chat: chatId, content: newMessage },
				// 		{
				// 			withCredentials: true,
				// 		}
				// 	);
				// 	setMessages((prevMessages) => [
				// 		...(prevMessages || []),
				// 		response.data,
				// 	]);
				// 	setText("");
				// } catch (err) {
				// 	console.error("Error sending message:", err);
				// }
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
				handleSendMessage();
				// setText("");
				// setOpen(false);
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
							onClick={() => handleSendMessage()}
							disabled={!text.trim()}
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
