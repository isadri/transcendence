import "../styles/GameRank.css";
import "../styles/TournamentHestory.css";
import bg1 from "../images/badge1.svg";
import { useEffect, useState } from "react";
import { getContext, getUser, getendpoint } from "../../../context/getContextData";
import axios from "axios";
import { FriendDataType } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import { TournamentRemoteData } from "../../Game/Tournament/Remote/Components/TournamentGames/TournamentGames";
import cup from '../images/tournamentImg.svg'
import NoTourn from '../images/No_tournament.svg'
import crown from '../../Game/images/crown.svg'

function GameRank() {
  const [usersRanking, setUseresRanking] = useState<TournamentRemoteData[]>([])
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
    axios.get(getendpoint("http", "/api/game/tournaments/"))
      .then((response) => {
        setUseresRanking(response.data)
        console.log(response.data)
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
            <div className="Home-RowEle elemens-tournament">
              <div className="Home-row1 cupImage">
                <div className="img">
                  <img src={cup} alt="" />
                </div>
                <div className="gmaeTournament">
                  <div className="Timg">
                    <img className="img1" src={getendpoint("http", user.player1.avatar)} alt=""
                      onClick={() => usersProfile(user.player1)} />
                  </div>
                  <div className="Timg">
                    <img className="img2" src={getendpoint("http", user.player2.avatar)} alt=""
                      onClick={() => usersProfile(user.player2)} />
                  </div>
                  <div className="Timg">
                    <img className="img3" src={getendpoint("http", user.player3.avatar)} alt=""
                      onClick={() => usersProfile(user.player3)} />
                  </div>
                  <div className="Timg">
                    <img className="img4" src={getendpoint("http", user.player4.avatar)} alt=""
                      onClick={() => usersProfile(user.player4)} />
                  </div>
                </div>
              </div>
              <div className="tournamentState">
                {
                  user.winner ?
                    <>
                      <div className="SetWinner">
                        <div className="crown">
                          <img src={crown} alt="" />
                        </div>
                      <div className="Timg">
                        <img className="imgWinner" src={getendpoint("http", user.player1.avatar)} alt=""
                          onClick={() => usersProfile(user.winner)} />
                      </div>
                        <span>Winner</span>
                      </div>
                      <span className="Finished">Finished</span>
                    </>
                    :
                    <span className="playing">Playing...</span>
                }
              </div>
            </div>
          </div>
        ))
      }
      {
        usersRanking.length === 0 &&
        <div className='Nostats game-NoStats'>
          <div className='stats-icon'>
            <img src={NoTourn} alt="" />
          </div>
          <div className='NoStats-msg'>
            <h3>No tournaments available</h3>
            <span>No tournaments games have been played yet. Once you start playing, your tournament history will appear here!</span>
          </div>
        </div>
      }

    </div>
  );
}

export default GameRank;
