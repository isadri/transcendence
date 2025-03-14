import "../styles/GameRank.css";
import "../styles/TournamentHestory.css";
import { useEffect, useState } from "react";
import { getendpoint } from "../../../context/getContextData";
import axios from "axios";
import { FriendDataType } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import { TournamentRemoteData } from "../../Game/Tournament/Remote/Components/TournamentGames/TournamentGames";
import cup from '../images/tournamentImg.svg'
import NoTourn from '../images/No_tournament.svg'
import crown from '../../Game/images/crown.svg'

function GameRank() {
  const [usersRanking, setUseresRanking] = useState<TournamentRemoteData[]>([])
  const navigate = useNavigate();

  const usersProfile = (user: FriendDataType) => {

      navigate(`/profile/${user.username}`)
  }

  const GetUsersRank = () => {
    axios.get(getendpoint("http", "/api/game/tournaments/"))
      .then((response) => {
        setUseresRanking(response.data)
      })
      .catch(() => {
      })
  }
  useEffect(() => {
    GetUsersRank()
  }, [])

  const handleGoToTournament = (id: Number) => {
    navigate(`/game/tournament/remote/${id}`)
  }

  return (
    <div className="Home-GameRank">
      {
        usersRanking.length !== 0 &&
        usersRanking.map((user) => (
          <div key={user.id} className="gamerank-ele" onClick={() => handleGoToTournament(user.id)} >
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
                        <img className="imgWinner" src={getendpoint("http", user.winner.avatar)} alt=""
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
