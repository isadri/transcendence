import { useEffect, useRef, useState } from "react";
import "./ChatBottom.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"; //npm i emoji-picker-react

interface ChatBottomProps {
	text: string;
	setText: React.Dispatch<React.SetStateAction<string>>;
	handleSend: () => void;
}

const ChatBottom: React.FC<ChatBottomProps> = ({
	text,
	setText,
	handleSend,
}) => {
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const closeEmoji = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLInputElement>(null);

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

	const handleEmojiClick = (emojiObject: EmojiClickData) => {
		setText((prev) => prev + emojiObject.emoji);
		if (inputRef.current) inputRef.current.focus();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="bottom">
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
	);
};

export default ChatBottom;
