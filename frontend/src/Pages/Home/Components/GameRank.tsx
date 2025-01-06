import "../styles/GameRank.css";
import bg1 from "../images/badge1.svg";
import { useEffect, useState } from "react";
import { getContext, getUser, getendpoint } from "../../../context/getContextData";
import axios from "axios";
import { FriendDataType } from "../../../context/context";
import { useNavigate } from "react-router-dom";

function GameRank() {
  const [usersRanking, setUseresRanking] = useState<FriendDataType[]>([])
  const authUser = getUser()
  const contxt = getContext()
  const navigate = useNavigate();

  const usersProfile = (user : FriendDataType) => {
    if (user.is_blocked){
      contxt?.setCreatedAlert("This user's profile is blocked, and you cannot access it.")
      contxt?.setDisplayed(3)
    }
    else
      navigate(`/profile/${user.username}`)
  }

  const GetUsersRank = () =>{
    axios.get(getendpoint("http", "/api/friends/usersRank"))
      .then((response) =>{
        setUseresRanking(response.data)
        console.log(response.data)
      })
      .catch ((error) =>{
        console.error("Error fetching friends list:", error);
      })
  }
  useEffect(() => {
    GetUsersRank()
  }, [])
  
  return (
    <div className="Home-GameRank">
        {
          usersRanking.length !== 0 &&
          usersRanking.map((user, index) => (
            <div key={user.id} className="gamerank-ele">
              <div className="Home-RowEle" style={user.id === authUser?.id ? {backgroundColor:"#c1596c54"}: {}}>
                <div className="Home-row1">
                  <span className="rank">{index + 1}</span>
                  <img src={bg1} alt="" />
                  <div className="Home-ProfileRev">
                    <img className="img" src={getendpoint("http", user.avatar)} alt=""
                    onClick={() => usersProfile(user)} />
                  </div>
                  <div className="rank-username">
                    <span onClick={() => usersProfile(user)} >{user.username}</span>
                  </div>
                </div>
                <div className="Home-row2">
                  <span>{user.stats.xp} xp</span>
                  <span>{user.stats.level} lvl</span>
                </div>
              </div>
            </div>
          ))
        }
        {
          usersRanking.length === 0 && 
          <div className='Nostats game-NoStats'>
              <div className='stats-icon'>
              <i className="fa-solid fa-ranking-star"></i>
              </div>
              <div className='NoStats-msg'>
                <h3>No rankings available</h3>
                <span>No games have been played yet across all users</span>
              </div>
            </div>
        }

    </div>
  );
}

export default GameRank;
