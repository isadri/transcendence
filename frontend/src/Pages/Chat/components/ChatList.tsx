import "./ChatList.css";
import { Friend } from "./types";

interface ChatListProps {
	friends: Friend[];
	onSelectFriend: (friend: Friend) => void;
	selectedFriend: Friend | null;
	setSearchFriend: React.Dispatch<React.SetStateAction<string>>;
	setFocusOnSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatList = ({
	friends,
	onSelectFriend,
	selectedFriend,
	setSearchFriend,
	setFocusOnSearch,
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
						setSearchFriend("")
						setFocusOnSearch(false)
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
