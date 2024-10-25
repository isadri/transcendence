import { ReactNode } from "react";

export interface Message {
	message: string;
	senderId: number;
	receiverId: number;
	time: string;
	image?: string;
	profile?: string;
}

export interface Friend {
	id: number;
	name: string;
	profile: string;
	message: string;
	time: string;
	status: ReactNode;
	// messageData: Message[];
}
