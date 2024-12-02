import { useEffect, useRef } from "react";
import "./ChatCenter.css";
import { GetChats } from "./ChatList";
import { useChatContext } from "./context/ChatUseContext";
// import { loginContext } from "../../../App";
import { getUser } from "../../../context/getContextData";

interface ChatCenterProps {
	selectedFriend: GetChats;
	// messages: ChatMessage[];
}

const ChatCenter = ({ selectedFriend }: ChatCenterProps) => {
	const endRef = useRef<HTMLDivElement>(null);
	const { messages } = useChatContext();
	const user = getUser();

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "instant" });
	}, [messages]);

	const filteredMessages =
		messages?.filter((msg) => msg.chat === selectedFriend.id) || [];

	return (
		<div className="center">
			{filteredMessages.map((value, index) => {
				const friend_user =
					user?.id === selectedFriend.user2.id
						? selectedFriend.user1
						: selectedFriend.user2;
				const isOwnMessage = value.sender === user?.id;
				return (
					<div key={index} className={isOwnMessage ? "message-own" : "message"}>
						{!isOwnMessage && (
							<img src={friend_user.avatar} alt="profile" className="profile" />
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
