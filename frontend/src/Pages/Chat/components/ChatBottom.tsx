import { forwardRef, useEffect, useReducer, useRef, useState } from "react";
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
		const { block, sendMessage, setBlock } = useChatContext();
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
			// const updatedFriend = { ...selectedFriend, is_blocked: block.status };
			// setSelectedFriend(updatedFriend);
			// forceReRender()
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

		// const fetchBlockedFriend : () => Number =  () => {
		// 	let friend_id;
		// 	if (user?.id === selectedFriend.user1.id) {
		// 		friend_id = selectedFriend.user2.id;
		// 	} else {
		// 		friend_id = selectedFriend.user1.id;
		// 	}
		// 	// console.log("1")
		// 	// try {
		// 		// console.log("2")
		// 		axios.get(
		// 			getendpoint("http", `/api/friends/blockedfriend/${friend_id}`),
		// 			{
		// 				withCredentials: true,
		// 			}
		// 		).then((response) => {
		// 			// console.log("3")
		// 			if (response.data.status === true) {
		// 				console.log("6")
		// 				console.log("is block: ",response.data, '-----selectide: ', friend_id, 'user id', user?.id)
		// 				// setBlock(response.data);
		// 				return 1
		// 			}
		// 			console.log("not block: ",response.data, '-----selectide: ', friend_id, 'user id', user?.id)
		// 			return 0
		// 		}).catch(() => {
		// 			return -1
		// 		})
		// 	// } catch (err) {
		// 	// 	console.log("4")
		// 	// 	console.log("Error in fetching chats", err);
		// 	// }
		// 	// console.log("5")
		// 	return -2
		// };

		// const fetchBlockedFriend = async (): Promise<number> => {
		// 	try {
		// 	  let friend_id;
		// 	  if (user?.id === selectedFriend.user1.id) {
		// 		friend_id = selectedFriend.user2.id;
		// 	  } else {
		// 		friend_id = selectedFriend.user1.id;
		// 	  }

		// 	  // Perform the API call and wait for the response
		// 	  const response = await axios.get(
		// 		getendpoint("http", `/api/friends/blockedfriend/${friend_id}`),
		// 		{
		// 		  withCredentials: true,
		// 		}
		// 	  );

		// 	  // Check the response and return the appropriate value
		// 	  if (response.data.status === true) {
		// 		console.log("is block: ", response.data, "-----selected: ", friend_id, "user id", user?.id);
		// 		return 1;
		// 	  } else {
		// 		console.log("not block: ", response.data, "-----selected: ", friend_id, "user id", user?.id);
		// 		return 0;
		// 	  }
		// 	} catch (err) {
		// 	  console.error("Error in fetching blocked friend:", err);
		// 	  return -1; // Return -1 on error
		// 	}
		//   };

		// console.log("here :", fetchBlockedFriend(), selectedFriend)

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
										setText("");
										return;
									}
									setText(event.target.value);
								}}
								onKeyDown={handleKeyDown}
								ref={ref}
								// rows={3}
							></textarea>
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
