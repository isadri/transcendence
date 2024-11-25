import { useEffect, useRef } from "react";
import "./ChatCenter.css";
import { GetFriends, FriendsMessages } from "../Chat";
// import { Message } from "./types";
// import { useMediaQuery } from "@uidotdev/usehooks"; // npm i @uidotdev/usehooks

interface ChatCenterProps {
	selectedFriend: GetFriends;
	messages: FriendsMessages[];
}

const ChatCenter = ({ selectedFriend, messages }: ChatCenterProps) => {
	// const isSmallDevice = useMediaQuery("only screen and (max-width : 478px)");
	const endRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "instant" });
	}, [messages]);

	return (
		<div className="center">
			{messages.map((value, index) => {
				const isOwnMessage = value.sender;
				return (
					<div key={index} className={isOwnMessage ? "message-own" : "message"}>
						{!isOwnMessage && (
							<img src={selectedFriend.avatar} alt="profile" className="profile" />
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
