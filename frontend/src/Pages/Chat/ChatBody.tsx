import { useEffect, useRef, useState } from "react";
import "./ChatBody.css";
import profile from "./images/profile.jpeg";
import cat from "./images/wallpaper.jpeg";
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
		if (inputRef.current)
			inputRef.current.focus();
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
				<div className="icon">
					{/* <i className="fa-solid fa-magnifying-glass search-icon"></i> */}
					<i className="fa-solid fa-ellipsis-vertical"></i>
				</div>
			</div>
			<div className="center">
				<div className="message">
					<img src={cat} alt="profile" />
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message-own">
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message">
					<img src={profile} alt="profile" />
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message-own">
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message">
					<img src={profile} alt="profile" />
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message-own">
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message">
					<img src={profile} alt="profile" />
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message-own">
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message">
					<img src={profile} alt="profile" />
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message-own">
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message">
					<img src={profile} alt="profile" />
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message-own">
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message">
					<img src={profile} alt="profile" />
					<div className="textMessage">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
				<div className="message-own">
					<div className="textMessage">
						<img src={cat} alt="" className="imgPartage" />
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
							aut architecto, unde ab eaque, praesentium minima amet at itaque
							cumque eum voluptates ex natus eos voluptatibus eveniet facilis
							quas et?
						</p>
						<span>1 min ago</span>
					</div>
				</div>
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
					<i className="fa-solid fa-paper-plane send-icon"></i>{" "}
				</button>
			</div>
		</div>
	);
};

export default ChatBody;
