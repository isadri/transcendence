import { forwardRef, useEffect, useRef, useState } from "react";
import "./ChatBottom.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
	GetChats,
	MessageType,
	useChatContext,
} from "./context/ChatUseContext";
import {
	getContext,
	getUser,
	getendpoint,
} from "../../../context/getContextData";
import axios from "axios";
// import Alert from "../../../components/Alert/Alert";

interface ChatBottomProps {
	selectedFriend: GetChats;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetChats | null>>;
}

const ChatBottom = forwardRef<HTMLTextAreaElement, ChatBottomProps>(
	({ selectedFriend, setSelectedFriend }, ref) => {
		const [open, setOpen] = useState(false);
		const closeEmoji = useRef<HTMLDivElement>(null);
		const buttonRef = useRef<HTMLDivElement>(null);
		const [text, setText] = useState("");
		const { block, sendMessage } = useChatContext();
		const user = getUser();
		const authContext = getContext();
		const [update, setUpdate] = useState(false);
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

		useEffect(() => {
			let friend_id;
			if (user?.id === selectedFriend.user1.id) {
				friend_id = selectedFriend.user2.id;
			} else {
				friend_id = selectedFriend.user1.id;
			}
			if (
				block.status &&
				(friend_id == block.blocked || friend_id == block.blocker)
			) {
				selectedFriend.is_blocked = block.status;
			} else {
				selectedFriend.is_blocked = false;
			}
			setSelectedFriend(selectedFriend);
			setUpdate(block.status);
			setText("");
		}, [block, selectedFriend.is_blocked]);

		const handleSendMessage = async () => {
			const maxLength = 300; // Set your max length
			if (text.trim().length > maxLength) {
				authContext?.setCreatedAlert("Message cannot exceed 300 characters.");
				authContext?.setDisplayed(2);
				return;
			}
			if (selectedFriend && text.trim()) {
				let receiver_id;
				if (user?.id === selectedFriend.user1.id) {
					receiver_id = selectedFriend.user2.id;
				} else {
					receiver_id = selectedFriend.user1.id;
				}
				// addded by jhamza
				try {
					const response = await axios.get(
						getendpoint("http", `/api/friends/blockedfriend/${receiver_id}`),
						{
							withCredentials: true,
						}
					);
					selectedFriend.is_blocked = response.data.status;
				} catch (err) {
					console.log("Error in fetching chats", err);
					selectedFriend.is_blocked = false;
				}

				if (selectedFriend.is_blocked) {
					setSelectedFriend({ ...selectedFriend });
					return;
				}
				// addded by jhamza
				sendMessage({
					message: text.trim(),
					receiver: receiver_id,
					message_type: MessageType.SendMessage,
				});
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

		const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === "Enter") {
				event.preventDefault();
				handleSendMessage();
			}
		};

		return (
			<div className="bottom">
				{!selectedFriend.is_blocked ? (
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
						{/* <div className="message-area"> */}
							<div className="messageContent">
								<textarea
									placeholder="Type a message..."
									value={text}
									onChange={(event) => {
										const maxLength = 300; // Set your max length
										if (event.target.value.trim().length > maxLength) {
											authContext?.setCreatedAlert(
												"Message cannot exceed 300 characters."
											);
											authContext?.setDisplayed(2);
											// setText("");
											return;
										}
										setText(event.target.value);
									}}
									onKeyDown={handleKeyDown}
									ref={ref}
								></textarea>
							</div>
							{text.trim().length > 295 && (
								<div>{300 - text.trim().length} </div>
							)}
						{/* </div> */}
						<button
							className="subButton"
							onClick={() => handleSendMessage()}
							disabled={!text.trim()}
						>
							<i className="fa-solid fa-paper-plane send-icon"></i>
						</button>
					</>
				) : (
					<div className="block">
						Can't send a message to this contact (block).
					</div>
				)}
			</div>
		);
	}
);

export default ChatBottom;
