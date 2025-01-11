import bg1 from "../../Profile/images/badges/bg1.svg";
import bg2 from "../../Profile/images/badges/bg2.svg";
import bg3 from "../../Profile/images/badges/bg3.svg";
import bg4 from "../../Profile/images/badges/bg4.svg";
import bg5 from "../../Profile/images/badges/bg5.svg";

import "../styles/GameRank.css";
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

  const usersProfile = (user: FriendDataType) => {
    // if (user.is_blocked) {
    //   contxt?.setCreatedAlert("This user's profile is blocked, and you cannot access it.")
    //   contxt?.setDisplayed(3)
    // }
    // else
      navigate(`/profile/${user.username}`)
  }

  const GetUsersRank = () => {
    axios.get(getendpoint("http", "/api/friends/usersRank"))
      .then((response) => {
        setUseresRanking(response.data)
      })
      .catch((error) => {
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
            <div className="Home-RowEle" style={user.id === authUser?.id ? { backgroundColor: "#c1596c54" } : {}}>
              <div className="Home-row1">
                <span className="rank">{index + 1}</span>
                <div className="badge-rank">
                  {
                    user.stats?.badge === -1 &&
                    <img className="Img noImg" src={bg1} alt="" />
                  }
                  {
                    user.stats?.badge === 0 &&
                    <img className="Img" src={bg1} alt="" />
                  }
                  {
                    user.stats?.badge === 1 &&
                    <img className="Img" src={bg2} alt="" />
                  }
                  {
                    user.stats?.badge === 2 &&
                    <img className="Img" src={bg3} alt="" />
                  }
                  {
                    user.stats?.badge === 3 &&
                    <img className="Img" src={bg4} alt="" />
                  }
                  {
                    user.stats?.badge === 4 &&
                    <img className="Img" src={bg5} alt="" />
                  }
                </div>
                <div className="Home-ProfileRev">
                  <img className="img" src={getendpoint("http", user.avatar)} alt=""
                    onClick={() => usersProfile(user)} />
                  {
                    user.is_online ?
                    <div className="onlineCircle-friend"></div>
                    :
                    <div className="onlineCircle-friend" style={{backgroundColor:'rgb(119 118 118)',
                    borderColor:'rgb(119 118 118)'}}></div>
                  }
                </div>
                <div className="rank-username">
                  <span onClick={() => usersProfile(user)} >{user.username}</span>
                </div>
              </div>
              <div className="Home-row2">
                <span>{user.stats.xp} xp</span>
                <span>lvl {user.stats.level} </span>
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
