import "../styles/LastGame.css";
import photo from "../images/profile.svg";
import Group from "../images/Group.svg";
import { useEffect, useState } from "react";
import { FriendDataType } from "../../../context/context";
import { getContext, getUser, getendpoint } from "../../../context/getContextData";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface GameDataType{
  id: number,
  player1: FriendDataType,
  player2: FriendDataType,
  start_at: string,
  p1_score: number,
  p2_score: number,
  winner: number
}


function LastGame() {
  // const [there_is_rank, setThere_is_rank] = useState(false) 
  const [userGames, setUserGames] = useState<GameDataType[]>([])

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

  const GetUserGames = () =>{
    axios.get(getendpoint("http", "/api/game/History/"))
      .then((response) =>{
        setUserGames(response.data)
        console.log(response.data)
      })
      .catch ((error) =>{
        console.error("Error fetching friends list:", error);
      })
  }
  useEffect(() => {
    GetUserGames()
  }, [])
  return (
    <div className="Home-LastGame">
        {
          userGames.length !== 0 &&
          userGames.map((usergame) => (
            <div key={usergame.id} className="Home-RowEle">
              <div className="Home-Row1">
                <img src={getendpoint("http",usergame.player2.avatar)} alt="" 
                onClick={() => usersProfile(usergame.player2)}/>
                <span>{usergame.player2.username}</span>
              </div>
              <div>
                <div className="Home-Row2">
                  <span className="Home-score1">{usergame.p2_score}</span>
                  <img src={Group} alt="" />
                  <span className="Home-score2">{usergame.p1_score}</span>
                </div>
              </div>
              <div className="Home-Row3">
                <span>{usergame.player1.username}</span>
                <img src={getendpoint("http", usergame.player1.avatar)} alt="" 
                onClick={() => usersProfile(usergame.player1)}/>
              </div>
            </div>
          ))
        }
        {
           userGames.length === 0 &&
           <div className='Nostats game-NoStats'>
               <div className='stats-icon'>
               <i className="fa-solid fa-table-tennis-paddle-ball"></i>
               </div>
               <div className='NoStats-msg'>
                 <h3>No games played yet</h3>
                 <span>You haven't played any games so far.
                  Once you start playing,
                  your game history will appear here!</span>
               </div>
             </div>
        }
    </div>
  );
}

export default LastGame;
