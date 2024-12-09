import { forwardRef, useEffect, useRef, useState } from "react";
import "./ChatBottom.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import { GetChats } from "./ChatList";
// import axios from "axios";
// import { getUser, getendpoint } from "../../../context/getContextData";
import { GetChats, MessageType, useChatContext } from "./context/ChatUseContext";
import { getUser } from "../../../context/getContextData";
// import { BlockedFriend } from "./ChatBody";

interface ChatBottomProps {
	selectedFriend: GetChats;
	// setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
	// block: BlockedFriend | null;
}

const ChatBottom = forwardRef<HTMLInputElement, ChatBottomProps>(
	({ selectedFriend }, ref) => {
		const [open, setOpen] = useState(false);
		const closeEmoji = useRef<HTMLDivElement>(null);
		const buttonRef = useRef<HTMLDivElement>(null);
		const [text, setText] = useState("");
		const { block,sendMessage } = useChatContext()
		const user = getUser()

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
				let receiver_id
				if (user?.id === selectedFriend.user1.id) {
					receiver_id = selectedFriend.user2.id
				} else {
					receiver_id = selectedFriend.user1.id
				}
				sendMessage({
					message: text.trim(),
					receiver: receiver_id,
					message_type: MessageType.SendMessage,
				})
				setText("");
				setOpen(false);
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
				{!block?.status ? (
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
								// disabled={block}
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
