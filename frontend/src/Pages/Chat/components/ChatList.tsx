import "./ChatList.css";
import { Friend } from "./types";

interface ChatListProps {
	friends: Friend[];
	onSelectFriend: (friend: Friend) => void;
	selectedFriend: Friend | null;
}

const ChatList = ({
	friends,
	onSelectFriend,
	selectedFriend,
}: ChatListProps) => {
	return (
		<div className="ChatList">
			{friends.map((friend) => (
				<div
					className={`item ${
						selectedFriend?.id === friend.id ? "selected" : ""
					}`}
					key={friend.id}
					onClick={() => {
						onSelectFriend(friend)
						
					}}
				>
					<img src={friend.profile} alt="profile" className="profile" />
					<div className="text">
						<span>{friend.name}</span>
						<p>{friend.message}</p>
					</div>
					<div className="ChatStatus">
						<div>{friend.time}</div>
						{friend.status}
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatList;
