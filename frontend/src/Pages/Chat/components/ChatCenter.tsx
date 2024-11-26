import { useEffect, useRef } from "react";
import "./ChatCenter.css";
// import { GetFriends } from "../Chat";
import { GetChats, ChatMessage } from "./ChatList";

interface ChatCenterProps {
	selectedFriend: GetChats;
	messages: ChatMessage[];
}

const ChatCenter = ({ selectedFriend, messages }: ChatCenterProps) => {
	const endRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "instant" });
	}, [messages]);

	return (
		<div className="center">
			{selectedFriend.messages.map((value, index) => {
				const isOwnMessage = value.sender === selectedFriend.user1;
				return (
					<div
						key={index}
						className={isOwnMessage ? "message-own" : "message"}
					>
						{!isOwnMessage && (
							<img
								src={selectedFriend.user2.avatar}
								alt="profile"
								className="profile"
							/>
						)}
						<div className="textMessage">
							{value.image && (
								<img
									src={value.image}
									alt="imgPartage"
									className="imgPartage"
								/>
							)}
							<p>{value.content}</p>
							<span>{value.timestamp}</span>
						</div>
					</div>
				);
			})}
			<div ref={endRef}></div>
		</div>
	);
};

export default ChatCenter;
