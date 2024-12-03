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
interface ChatContextType {
	socket: WebSocket | null;
	sendMessage: (data: { message: string; receiver: number }) => void;
	messages: ChatMessage[];
	setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
	lastMessage: { [chatId: number]: string | null };
	setLastMessage: React.Dispatch<React.SetStateAction<{ [chatId: number]: string | null }>>;
}

const ChatContext = createContext<ChatContextType>({
	socket: null,
	sendMessage: () => {},
	messages: [],
	setMessages: () => {},
	lastMessage: {},
	setLastMessage: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [lastMessage, setLastMessage] = useState<{ [chatId: number]: string | null }>({});

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
				}
				setMessages((prev) => [...prev, newMessage]);
				setLastMessage((prev) => ({
					...prev,
					[data.chat_id]: data.message,
				  }));
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
			value={{ socket, sendMessage, messages, lastMessage, setMessages, setLastMessage }}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChatContext = () => useContext(ChatContext);
