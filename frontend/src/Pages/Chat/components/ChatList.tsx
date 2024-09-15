import "./ChatList.css";
import DataFriends from "./DataFriends";

const ChatList = () => {
	return (
		<div className="ChatList">
			{DataFriends.map((value) => {
				return (
					<div className="item" key={value.id}>
						<img src={value.profile} alt="profile" className="profile" />
						<div className="text">
							<span> {value.name} </span>
							<p> {value.message} </p>
						</div>
						<div className="ChatStatus">
							<div> {value.time} </div>
							{value.status}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ChatList;
