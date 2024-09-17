import ChatList from "./ChatList";
import "./List.css";
import { Friend } from "./types";

interface ListProps {
  friends: Friend[];
  onSelectFriend: (friend: Friend) => void;
  selectedFriend: Friend | null;
}

const List = ({ friends, onSelectFriend, selectedFriend }: ListProps) => {
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
      <ChatList 
        friends={friends} 
        onSelectFriend={onSelectFriend} 
        selectedFriend={selectedFriend}
      />
    </>
  );
};

export default List;