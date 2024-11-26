import { useState, useEffect } from "react";
import "./Chat.css";
import ChatBody from "./components/ChatBody";
import ListChat from "./components/List";
import moment from "moment";
import { useMediaQuery } from "@uidotdev/usehooks"; // npm i @uidotdev/usehooks
import axios from "axios";
import { GetChats } from "./components/ChatList";

export interface GetFriends {
	id: number;
	username: string;
	avatar: string;
}

const Chat = () => {
	const isSmallDevice = useMediaQuery("only screen and (max-width : 478px)");
	const [selectedFriend, setSelectedFriend] = useState<GetChats | null>(null);

	const [getFriends, setGetFriends] = useState<GetFriends[]>([]);

	useEffect(() => {
		const fetchFriend = () => {
			axios
				.get("http://0.0.0.0:8000/api/friends/friends", {
					withCredentials: true, // Include cookies in the request
				})
				.then((response) => {
					setGetFriends(response.data.friends);
					// console.log(response.data.friends)
				})
				.catch((err) => {
					console.log(err.data); // Set the response data to state
				});
		};

		fetchFriend();
	}, [selectedFriend]);

	const handleSelectFriend = (friend: GetChats) => {
		setSelectedFriend(friend);
	};

	return (
		<div className="Chat">
			{isSmallDevice ? (
				!selectedFriend && (
					<div className="Chat-List">
						<ListChat
							friends={getFriends}
							onSelectFriend={handleSelectFriend}
							selectedFriend={selectedFriend}
						/>
					</div>
				)
			) : (
				<div className="Chat-List">
					<ListChat
						friends={getFriends}
						onSelectFriend={handleSelectFriend}
						selectedFriend={selectedFriend}
					/>
				</div>
			)}
			{isSmallDevice ? (
				<div className={`Messages ${selectedFriend ? "" : "inactive"}`}>
					{selectedFriend ? (
						<ChatBody
							selectedFriend={selectedFriend}
							setSelectedFriend={setSelectedFriend}
						/>
					) : (
						<div></div>
					)}
				</div>
			) : (
				<div className="Messages">
					{selectedFriend ? (
						<ChatBody
							selectedFriend={selectedFriend}
							setSelectedFriend={setSelectedFriend}
						/>
					) : (
						<div className="backgroundOfChat">
							<img
								src="./ChatImages/backgroundOfChat.svg"
								alt="backgroundOfChat"
							/>
							<span>Welcome to Chat!</span>
							<p>
								Please select a friend from your contacts list to start a
								conversation. We're here when you're ready to chat!
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Chat;
