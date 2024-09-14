import { useEffect, useRef, useState } from "react";
import "./ChatBody.css";
import profile from "./images/profile.jpeg";
import DataMessage from "./DataMessage";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"; //npm i emoji-picker-react

const ChatBody = () => {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");

	const endRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const handleEmojiClick = (emojiObject: EmojiClickData) => {
		setText((prev) => prev + emojiObject.emoji);
		setOpen(false);
		if (inputRef.current) inputRef.current.focus();
	};

	return (
		<div className="chatContent">
			<div className="top">
				<div className="profileInfo">
					<img src={profile} alt="profile" className="image" />
					<div className="textInfo">
						<span>yasmine lachhab</span>
						<p>Last seen today 00:56</p>
					</div>
				</div>
				<i className="fa-solid fa-ellipsis-vertical icon"></i>
			</div>
			<div className="center">
				{DataMessage.map((value) => {
					return (
						<div
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
						ref={inputRef}
					/>
				</div>
				<button className="subButton">
					<i className="fa-solid fa-paper-plane send-icon"></i>
				</button>
			</div>
		</div>
	);
};

export default ChatBody;
