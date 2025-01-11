import '../styles/Chat.css'
import axios from 'axios'
import { getendpoint } from '../../../context/getContextData'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface stats{
  level: number,
  badge: number,
  win: number,
  lose: number,
  nbr_games: number
}


interface FriendData{
  id: number,
  username: string,
  email: string,
  avatar: string,
  is_online: boolean,
  is_blocked: boolean,
  stats: stats
}

function Chat() {
  const navigate = useNavigate(); 
  const [friendsList, setFriendsList] = useState<FriendData[]>([]);
  const GetFriendsList = () =>{
    axios.get(getendpoint("http", "/api/friends/friends"),{withCredentials:true})
      .then((response) =>{
        setFriendsList(response.data.friends)
      })
      .catch (() =>{
      })
  }
  useEffect(() => {
    GetFriendsList();
  }, []);
  return (
    <div className="Home-ChatRev">
      <div className="Home-Icon">
      <i className="fa-solid fa-user-group"></i>
      </div>
      <div className="Home-friends">
        {friendsList.map((friend) => (
          <div key={friend.id} className="Home-friends-item">
             <div className='Cimg'>
                <img src={getendpoint("http", friend.avatar)} alt={`${friend.username}'s avatar`}
                  onClick={() => navigate(`/profile/${friend.username}`)}/>
              {
                friend.is_online ?
                <div className="onlineCircle-friend"></div>
                :
                <div className="onlineCircle-friend" style={{backgroundColor:'rgb(119 118 118)', borderColor:'rgb(119 118 118)'}}></div>
              }
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
