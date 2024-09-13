import "./Chat.css";
import ChatBody from "./ChatBody";
import ListChat from "./List";

const Chat = () => {
	return (
		<div className="Chat">
			<div className="List">
				<ListChat/>
			</div>
			<div className="Messages">
				<ChatBody />
			</div>
		</div>
	);
};

export default Chat;
