import React, { createContext, useContext, useEffect, useState } from "react";
import { getendpoint } from "../../../../context/getContextData";

export interface ChatMessage {
	id: number;
	chat: number;
	sender: number;
	receiver: number;
	content: string;
	timestamp: string;
	file?: string | null;
	image?: string | null;
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
}

interface ChatContextType {
	socket: WebSocket | null;
	sendMessage: (data: { message: string; receiver: number }) => void;
	messages: ChatMessage[];
	setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
	lastMessage: LastMessage;
	setLastMessage: React.Dispatch<React.SetStateAction<LastMessage>>;
	chats: GetChats[];
	setChats: React.Dispatch<React.SetStateAction<GetChats[]>>;
}

const ChatContext = createContext<ChatContextType>({
	socket: null,
	sendMessage: () => {},
	messages: [],
	setMessages: () => {},
	lastMessage: {},
	setLastMessage: () => {},
	chats: [],
	setChats: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [lastMessage, setLastMessage] = useState<LastMessage>({});
	const [chats, setChats] = useState<GetChats[]>([]);

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
				const newMessage: ChatMessage = {
					id: Date.now(),
					chat: data.chat_id,
					sender: data.sender_id,
					receiver: data.receiver_id,
					content: data.message,
					timestamp: new Date().toISOString(),
					file: null,
					image: null,
				};
				setMessages((prev) => [...prev, newMessage]);
				setLastMessage((prev) => ({
					...prev,
					[data.chat_id]: {
						content: data.message,
						timestamp: newMessage.timestamp,
					},
				}));
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
							messages: [...updatedChats[existingChatIndex].messages, newMessage],
						};
						return updatedChats;
					} else {
						// Add new chat
						const newChat: GetChats = {
							id: data.chat_id,
							user1: data.sender,
							user2: data.receiver,
							created_at: newMessage.timestamp,
							last_message: data.message,
							messages: [newMessage],
						};
						return [...prevChats, newChat];
					}
				});
			} catch (err) {
				console.error("Error parsing WebSocket message: ", err);
			}
		};

		setSocket(ws);

		return () => ws.close(); // Clean up the WebSocket on component unmont
	}, []);

	const sendMessage = (data: { message: string; receiver: number }) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(data));
		} else {
			console.error("WebSocket is not open.");
		}
	};

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
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChatContext = () => useContext(ChatContext);
