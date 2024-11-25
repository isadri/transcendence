import { useRef, useState } from "react";
import "./ChatBody.css";
import ChatTop from "./ChatTop";
import ChatCenter from "./ChatCenter";
import ChatBottom from "./ChatBottom";
import moment from "moment";
import { GetFriends, FriendsMessages } from "../Chat";
// import { Friend, Message } from "./types";

interface ChatBodyProps {
	selectedFriend: GetFriends;
	messages: FriendsMessages[];
	onSendMessage: (message: string) => void;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetFriends | null>>;
	setMessages: React.Dispatch<React.SetStateAction<FriendsMessages[]>>;
}

const ChatBody = ({
	selectedFriend,
	messages,
	onSendMessage,
	setSelectedFriend,
	setMessages,
}: ChatBodyProps) => {
	const [text, setText] = useState("");
	const ref = useRef<HTMLInputElement>(null);
	const [block, setBlock] = useState(false);

	const handleSend = () => {
		if (text.trim()) {
			onSendMessage(text);
			setText("");
		}
	};

	return (
		<div className="chatContent">
			<ChatTop
				selectedFriend={selectedFriend}
				setSelectedFriend={setSelectedFriend}
				setMessages={setMessages}
				setBlock={setBlock}
				block={block}
			/>
			<ChatCenter messages={messages} selectedFriend={selectedFriend} />
			{/* <ChatBottom
				text={text}
				setText={setText}
				handleSend={handleSend}
				ref={ref}
				block={block}
			/> */}
		</div>
	);
};

export default ChatBody;
