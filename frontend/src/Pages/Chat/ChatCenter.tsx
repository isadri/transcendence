import {useRef, useState } from "react";
import "./ChatBody.css";
import DataMessage from "./DataMessage";

interface Props {
	
}

interface Message {
	message: string;
	senderId: number;
	receverId: number;
	time: string;
	image?: string;
	profile?: string;
}

const ChatCenter = () => {
	const [messages, setMessages] = useState<Message[]>(DataMessage);

	const endRef = useRef<HTMLDivElement>(null);

  return (
	<div className="center">
				{messages.map((value, index) => {
					return (
						<div
							key={index}
							className={` ${
								value.senderId === 1 ? "message" : "message-own"
							} `}
						>
							{value.senderId === 1 && (
								<img src={value.profile} alt="profile" className="profile" />
							)}
							<div className="textMessage">
								{value.image !== "" && value.image !== undefined && (
									<img
										src={value.image}
										alt="imgPartage"
										className="imgPartage"
									/>
								)}
								<p>{value.message}</p>
								<span>{value.time}</span>
							</div>
						</div>
					);
				})}
				<div ref={endRef}></div>
			</div>
  )
}

export default ChatCenter