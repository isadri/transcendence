import '../styles/Chat.css'
import axios from 'axios'
import { getendpoint } from '../../../context/getContextData'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface FriendData{
  id : number,
  username: string,
  avatar : string
}

function Chat() {
  const navigate = useNavigate(); 
  const [friendsList, setFriendsList] = useState<FriendData[]>([]);
  const GetFriendsList = () =>{
    axios.get(getendpoint("http", "/api/friends/friends"),{withCredentials:true})
      .then((response) =>{
        setFriendsList(response.data.friends)
      })
      .catch ((error) =>{
        console.error("Error fetching friends list:", error);
      })
  }
  useEffect(() => {
    GetFriendsList();
  }, []);

  return (
    <div className="Home-ChatRev">
      <div className="Home-Icon">
        <i className="fa-solid fa-comment-dots fa-lg"></i>
      </div>
      <div className="Home-friends">
        {friendsList.map((friend) => (
          <div key={friend.id} className="Home-friends-item">
              <img src={friend.avatar} alt={`${friend.username}'s avatar`}
              onClick={() => navigate(`/profile/${friend.username}`)}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
