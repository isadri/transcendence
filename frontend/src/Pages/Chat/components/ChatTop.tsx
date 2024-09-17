import { Friend } from "./types";
import "./ChatTop.css";

interface ChatTopProps {
  selectedFriend: Friend;
}

const ChatTop = ({ selectedFriend }: ChatTopProps) => {
  return (
    <div className="top">
      <div className="profileInfo">
        <img src={selectedFriend.profile} alt="profile" className="image" />
        <div className="textInfo">
          <span>{selectedFriend.name}</span>
          <p>Last seen today 00:56</p>
        </div>
      </div>
      <i className="fa-solid fa-ellipsis-vertical icon"></i>
    </div>
  );
};

export default ChatTop;