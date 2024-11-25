import { GetFriends } from "../Chat";
import "./ChatList.css";
import axios from "axios";
// import { Friend } from "./types";

interface ChatListProps {
	friends: GetFriends[];
	onSelectFriend: (friend: GetFriends) => void;
	selectedFriend: GetFriends | null;
	setSearchFriend: React.Dispatch<React.SetStateAction<string>>;
	setFocusOnSearch: React.Dispatch<React.SetStateAction<boolean>>;
	listAllFriends: boolean;
	setListAllFriends: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatList = ({
	friends,
	onSelectFriend,
	selectedFriend,
	setSearchFriend,
	setFocusOnSearch,
	listAllFriends,
	setListAllFriends,
}: ChatListProps) => {

	const handleAddConversationRequests = (id: number) => {
		axios
			.post("http://0.0.0.0:8000/api/chat/chats/", {user2: id}, {
				withCredentials: true,
			})
			.then((response) => {
				console.log(response.data)
				// need to add this to the conversation
				// setAllUsers((prev) =>
				// 	prev.filter((request) => request.id !== id)
				// );
			})
			.catch((error) => {
				console.error("Error accepting friend request:", error);
			});
	};
	
	return (
		<div className="ChatList">
			{friends.map((friend) => (
				<div
					className={`item ${
						selectedFriend?.id === friend.id ? "selected" : ""
					}`}
					key={friend.id}
					onClick={() => {
						handleAddConversationRequests(friend.id)
						onSelectFriend(friend)
						setSearchFriend("")
						setFocusOnSearch(false)
						setListAllFriends(false)
					}}
				>
					<img src={friend.avatar} alt="profile" className="profile" />
					<div className="text">
						<span>{friend.username}</span>
						{!listAllFriends && <p>{friend.message}</p>}
					</div>
					{/* {!listAllFriends && <div className="ChatStatus">
						<div>{friend.time}</div>
						{friend.status}
					</div>} */}
				</div>
			))}
		</div>
	);
};

export default ChatList;
