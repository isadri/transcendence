import { useState, useEffect } from "react";
import "./Chat.css";
import ChatBody from "./components/ChatBody";
import ListChat from "./components/List";
// import moment from "moment";
import { useMediaQuery } from "@uidotdev/usehooks"; // npm i @uidotdev/usehooks
import axios from "axios";
import { getContext, getendpoint } from "../../context/getContextData";
import {
	ChatProvider,
	GetFriends,
	GetChats,
	useChatContext,
} from "./components/context/ChatUseContext";
import Alert from "../../components/Alert/Alert";

const Chat = () => {
	const isSmallDevice = useMediaQuery("only screen and (max-width : 478px)");
	const [selectedFriend, setSelectedFriend] = useState<GetChats | null>(null);

	const [getFriends, setGetFriends] = useState<GetFriends[]>([]);
	const { activeChat } = useChatContext()

	useEffect(() => {
		const fetchFriend = async () => {
			try {
				const response = await axios.get(
					getendpoint("http", "/api/friends/users"),
					{
						withCredentials: true,
					}
				);
				console.log("here we are users: ",response.data)
				setGetFriends(response.data || []);
			} catch (err) {
				console.error("Error fetching friends:", err);
			}
		};

		fetchFriend();
	}, [selectedFriend]);

	const handleSelectFriend = (friend: GetChats) => {
		setSelectedFriend(friend);
		activeChat({chatid: friend.id})
	};
	const account = getContext();
	return (
		<ChatProvider>
			<Alert primaryColor="red" secondaryColor="#f18b8b">
			<i className="fa-solid fa-circle-exclamation"></i>
				<span>{account?.createdAlert}</span>
			</Alert>
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
		</ChatProvider>
	);
};

export default Chat;
