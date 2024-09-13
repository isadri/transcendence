import ChatList from "./ChatList";
import "./List.css"

const List = () => {
	return (
		<>
			<div className="container">
				<div>Messages</div>
				<i className="fa-solid fa-ellipsis-vertical"></i>
			</div>
			<div className="search">
				<div className="search-container">
					<i className="fa-solid fa-magnifying-glass search-icon"></i>
					<input type="text" placeholder="search..." />
				</div>
			</div>
			<ChatList />
		</>
	);
};

export default List;
