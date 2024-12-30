import { useEffect, useRef, useState } from "react";
import "./ChatCenter.css";
import {
	ChatMessage,
	GetChats,
	useChatContext,
} from "./context/ChatUseContext";
import { getUser } from "../../../context/getContextData";

interface ChatCenterProps {
	selectedFriend: GetChats;
	messagesUser: ChatMessage[];
}

const ChatCenter = ({ selectedFriend, messagesUser }: ChatCenterProps) => {
	const endRef = useRef<HTMLDivElement>(null);
	const { messages } = useChatContext();
	const user = getUser();
	const [messagesUpdate, setMessagesUpdate] = useState<ChatMessage[]>([]);

	useEffect(() => {
		// setMessagesUser(messages)
		endRef.current?.scrollIntoView({ behavior: "instant" });
	}, [messagesUpdate]);

	useEffect(() => {
		const lastMessag = messages[messages.length - 1];
		if (lastMessag?.chat == selectedFriend.id)
			setMessagesUpdate([...messagesUser, ...messages]);
		else setMessagesUpdate([...messagesUser]);
	}, [messages, messagesUser, selectedFriend]);

	const formatTimes = (time: string) => {
		const date = new Date(time);
		return Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	};
	return (
		<div className="center">
			{messagesUpdate.map((value, index) => {
				const friend_user =
					user?.id === selectedFriend.user1.id
						? selectedFriend.user2
						: selectedFriend.user1;
				const isOwnMessage = value.sender === user?.id;
				return (
					<div key={index} className={isOwnMessage ? "message-own" : "message"}>
						{!isOwnMessage && (
							<img src={friend_user.avatar} alt="profile" className="profile" />
						)}
						<div className="textMessage">
							<p>{value.content}</p>
							<span>{formatTimes(value.timestamp)}</span>
						</div>
					</div>
				);
			})}
			<div ref={endRef}></div>
		</div>
	);
};

export default ChatCenter;

