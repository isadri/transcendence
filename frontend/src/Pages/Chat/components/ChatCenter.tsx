import { useEffect, useRef } from "react";
import "./ChatCenter.css";
import { Message } from "./types";

interface ChatCenterProps {
	messages: Message[];
}

const ChatCenter = ({ messages }: ChatCenterProps) => {
	const endRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "instant" });
	}, [messages]);

	return (
		<div className="center">
			{messages.map((value, index) => {
				const isOwnMessage = value.senderId === 2;
				return (
					<div key={index} className={isOwnMessage ? "message-own" : "message"}>
						{!isOwnMessage && (
							<img src={value.profile} alt="profile" className="profile" />
						)}
						<div className="textMessage">
							{value.image && (
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
	);
};

export default ChatCenter;
