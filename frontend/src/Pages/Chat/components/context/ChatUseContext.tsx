import React, { createContext, useContext, useEffect, useState } from "react";
import { getendpoint } from "../../../../context/getContextData";

export interface ChatMessage {
	id: number;
	chat: number;
	sender: number;
	receiver: number;
	content: string;
	timestamp: string;
}

interface LastMessage {
	[chatId: number]: {
		content: string | null;
		timestamp: string | null;
	};
}

export interface GetFriends {
	id: number;
	username: string;
	avatar: string;
}

export interface GetChats {
	id: number;
	user1: GetFriends;
	user2: GetFriends;
	created_at: string;
	last_message: string | null;
	messages: ChatMessage[];
	nbr_of_unseen_msg_user1?: number | 0;
	nbr_of_unseen_msg_user2?: number | 0;
}

export interface BlockedFriend {
	chatid?: number;
	status: boolean;
	blocked: number;
	blocker: number;
}

interface ChatContextType {
	socket: WebSocket | null;
	sendMessage: (data: {
		message: string;
		receiver: number;
		message_type: MessageType;
	}) => void;
	blockUnblockFriend: (data: {
		chatid: number;
		blocker: number;
		blocked: number;
		status: true | false;
	}) => void;
	messages: ChatMessage[];
	setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
	lastMessage: LastMessage;
	setLastMessage: React.Dispatch<React.SetStateAction<LastMessage>>;
	chats: GetChats[];
	setChats: React.Dispatch<React.SetStateAction<GetChats[]>>;
	block: BlockedFriend | null;
	setBlock: React.Dispatch<React.SetStateAction<BlockedFriend | null>>;
	unseen: boolean;
	setUnseen: React.Dispatch<React.SetStateAction<boolean>>;
	activeChatId: number | null;
	setActiveChatId: React.Dispatch<React.SetStateAction<number | null>>;
	activeChat: (data: { chatid: number }) => void;
	unseenMessage: (data: { chatid: number }) => void;
	// deleteChat: (data: {chatId: number, message_type: MessageType}) => void;
}

const ChatContext = createContext<ChatContextType>({
	socket: null,
	sendMessage: () => {},
	blockUnblockFriend: () => {},
	messages: [],
	setMessages: () => {},
	lastMessage: {},
	setLastMessage: () => {},
	chats: [],
	setChats: () => {},
	block: null,
	setBlock: () => {},
	unseen: false,
	setUnseen: () => {},
	activeChatId: null,
	setActiveChatId: () => {},
	activeChat: () => {},
	unseenMessage: () => {},
	// deleteChat: () => {},
});

export enum MessageType {
	SendMessage = "send_message",
	BlockFriend = "block_friend",
	ActiveChat = "active_chat",
	MarkRead = "mark_is_read",
	// DeleteChat = "delete_chat",
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [lastMessage, setLastMessage] = useState<LastMessage>({});
	const [chats, setChats] = useState<GetChats[]>([]);
	const [block, setBlock] = useState<BlockedFriend | null>(null);
	const [unseen, setUnseen] = useState<boolean>(false);
	const [activeChatId, setActiveChatId] = useState<number | null>(null);

	useEffect(() => {
		const ws = new WebSocket(getendpoint("ws", `/ws/chat/`));
		ws.onopen = () => console.log("WebSocket connected");
		ws.onclose = () => console.log("WebSocket disconnected");
		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				if (data.type === "block_status_update") {
					setBlock({
						chatid: data.chat_id,
						status: data.status,
						blocker: data.blocker,
						blocked: data.blocked,
					});
				}
				if (data.type === "update_unseen_message") {
					setChats((prevChats) =>
						prevChats.map((chat) =>
							chat.id === data.chat_id
								? {
										...chat,
										nbr_of_unseen_msg_user1: data.nbr_of_unseen_msg_user1,
										nbr_of_unseen_msg_user2: data.nbr_of_unseen_msg_user2,
								  }
								: chat
						)
					);

					// Update unseen state if necessary
					setUnseen(data.status);
				}

				// if (data.type === MessageType.DeleteChat) {
				// 	const chat_id  = data.chat_id;
				// 	if (chat_id) {
				// 		// Remove the chat from state
				// 		setChats((prevChats) => prevChats.filter((chat) => chat.id !== chat_id));
				// 		setMessages((prevMessages) => prevMessages.filter((msg) => msg.chat !== chat_id));
				// 		console.log("********************");

				// 		// setLastMessage((prevLastMessage) => {
				// 		// 	const updatedLastMessage = { ...prevLastMessage };
				// 		// 	delete updatedLastMessage[chat_id];
				// 		// 	return updatedLastMessage;
				// 		// });
				// 	}
				// }

				// if (data.type === MessageType.BlockChat) {
				// 	setBlock({
				// 		chatid: data.chat_id,
				// 		blocked: true,
				// 		blocked_by_id: data.blocked_by_id,
				// 	})
				// }

				if (data.type === MessageType.SendMessage) {
					if (!data.chat_id || !data.message) {
						console.error("Invalid WebSocket message: ", data);
						return;
					}
					const newMessage: ChatMessage = {
						id: Date.now(),
						chat: data.chat_id,
						sender: data.sender_id,
						receiver: data.receiver_id,
						content: data.message,
						timestamp: new Date().toISOString(),
					};

					setMessages((prev) => [...prev, newMessage]);
					setLastMessage((prev) => ({
						...prev,
						[data.chat_id]: {
							content: data.message,
							timestamp: newMessage.timestamp,
						},
					}));
					// setChats((prevChats) =>
					// 	prevChats.map((chat) =>
					// 		chat.id === data.chat_id
					// 			? {
					// 					...chat,
					// 					nbr_of_unseen_msg_user1: data.nbr_of_unseen_msg_user1,
					// 					nbr_of_unseen_msg_user2: data.nbr_of_unseen_msg_user2,
					// 			  }
					// 			: chat
					// 	)
					// );
					setChats((prevChats) => {
						const existingChatIndex = prevChats.findIndex(
							(chat) => chat.id === data.chat_id
						);

						if (existingChatIndex !== -1) {
							// Update existing chat
							const updatedChats = [...prevChats];
							updatedChats[existingChatIndex] = {
								...updatedChats[existingChatIndex],
								last_message: data.message,
								messages: [
									...updatedChats[existingChatIndex].messages,
									newMessage,
								],
							};
							return updatedChats;
						} else {
							// Add new chat
							const newChat: GetChats = {
								id: data.chat_id,
								user1: data.sender_id,
								user2: data.receiver_id,
								created_at: newMessage.timestamp,
								last_message: data.message,
								messages: [newMessage],
								nbr_of_unseen_msg_user1: data.nbr_of_unseen_msg_user1,
								nbr_of_unseen_msg_user2: data.nbr_of_unseen_msg_user2,
							};
							return [...prevChats, newChat];
						}
					});
				}
			} catch (err) {
				console.error("Error parsing WebSocket message: ", err);
			}
		};

		setSocket(ws);

		return () => ws.close(); // Clean up the WebSocket on component unmont
	}, [setChats]);
	const sendMessage = (data: {
		message: string;
		receiver: number;
		message_type: MessageType;
	}) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(data));
		} else {
			console.error("WebSocket is not open.");
		}
	};

	const blockUnblockFriend = (data: {
		chatid: number;
		blocker: number;
		blocked: number;
		status: true | false;
	}) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(
				JSON.stringify({
					message_type: MessageType.BlockFriend,
					chat_id: data.chatid,
					blocker: data.blocker,
					blocked: data.blocked,
					status: data.status,
				})
			);
		} else {
			console.error("WebSocket is not open.");
		}
	};
	const activeChat = (data: { chatid: number }) => {
		setActiveChatId(data.chatid);
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(
				JSON.stringify({
					message_type: MessageType.ActiveChat,
					chat_id: data.chatid,
				})
			);
		} else {
			console.error("WebSocket is not open.");
		}
	};

	const unseenMessage = (data: { chatid: number }) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(
				JSON.stringify({
					message_type: MessageType.MarkRead,
					chat_id: data.chatid,
				})
			);

			setChats((prevChats) =>
				prevChats.map((chat) =>
					chat.id === data.chatid
						? {
								...chat,
								nbr_of_unseen_msg_user1: 0,
								nbr_of_unseen_msg_user2: 0,
						  }
						: chat
				)
			);
		} else {
			console.error("WebSocket is not open.");
		}
	};

	// const deleteChat = (data: {chatId: number; message_type: MessageType }) => {
	// 	if (socket && socket.readyState === WebSocket.OPEN) {
	// 		console.log(socket);
	// 		socket.send(JSON.stringify(data));
	// 		// socket.send(JSON.stringify({
	// 		// 	type: MessageType.DeleteChat,
	// 		// 	chat_id: chatId,
	// 		// }));
	// 	} else {
	// 		console.error("WebSocket is not open.");
	// 	}
	// };

	return (
		<ChatContext.Provider
			value={{
				socket,
				sendMessage,
				messages,
				lastMessage,
				setMessages,
				setLastMessage,
				chats,
				setChats,
				block,
				setBlock,
				blockUnblockFriend,
				activeChat,
				unseenMessage,
				unseen,
				setUnseen,
				activeChatId,
				setActiveChatId,
				// deleteChat,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChatContext = () => useContext(ChatContext);
