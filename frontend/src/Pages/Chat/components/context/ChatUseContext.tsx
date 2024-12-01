import React, { createContext, useContext, useEffect, useState } from "react";
// need to add the user who authenticated
interface ChatContextType {
	// userId: number | null;
	socket: WebSocket | null;
	sendMessage: (data: { message: string; receiver: number}) => void;
}

const ChatContext = createContext<ChatContextType>({
	// userId: null,
	socket: null,
	sendMessage: () => {},
})

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
	// const [userId, seUserId] = useState<number | null>(null)
	const [socket, setSocket] = useState<WebSocket | null>(null)

	useEffect(() => {
		const ws = new WebSocket(`ws://0.0.0.0:8000/ws/chat/`)
		ws.onopen = () => console.log("WebSocket connected")
		ws.onclose = () => console.log("WebSocket disconnected")
		
		setSocket(ws)

		return () => {
			ws.close(); // Clean up the WebSocket on component unmont
		}
	}, [])

	const sendMessage = (data: { message: string; receiver: number}) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(data));
		}
	}

	return (
		// <ChatContext.Provider value={{userId, socket, sendMessage}}>
		<ChatContext.Provider value={{ socket, sendMessage}}>
			{children}
		</ChatContext.Provider>
	)

}


export const useChatContext = () => useContext(ChatContext);