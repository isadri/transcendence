import "./Chat.css";
import ChatList from "./ChatList";

const Chat = () => {
	return (
		<div className="List">
			<div className="messages">
				<div className="container">
					<div>Messages</div>
					<i className="fa-solid fa-ellipsis-vertical"></i>
				</div>
				<div className="search">
					<div className="search-container">
						<i className="fa-solid fa-magnifying-glass search-icon"></i>
						<input
							type="text"
							placeholder="search..."
							className="{} search-input"
						/>
					</div>
				</div>
				<ChatList />
			</div>
		</div>
	);
};

export default Chat;
