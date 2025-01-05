import "./RemoteGame.css"
import vs from "../../../../../home/images/Group.svg"
import { TournamentRemoteGameData } from "../TournamentGames/TournamentGames";
import { FriendDataType } from "../../../../../../context/context";
import { getendpoint } from "../../../../../../context/getContextData";

interface RemoteGameProps {
  game?: TournamentRemoteGameData | null,
  players: FriendDataType[] | null
}

function RemoteGame({ game, players }: RemoteGameProps) {
  return (
    <div className="RemoteGame">
      {
        game ?
          <div className="RemoteGameLeft">
            <img src={players ? getendpoint("http", players[0].avatar) : ""} />
            <span>{game && players ? players[0].username : "-----------------"}</span>
          </div>
          :
          <div className="RemoteGameResult">waiting</div>
      }
      <div className="RemoteGameResult">
        <div> {game ? game.p1_score : ""} </div>
        <img src={vs} />
        <div> {game ? game.p2_score : ""} </div>
      </div>

      {
        game ?
          <div className="RemoteGameRight">
            <span>{game && players ? players[1].username : "-----------------"}</span>
            <img src={players ? getendpoint("http", players[1].avatar) : ""} />
          </div>
          :
          <div className="RemoteGameResult">waiting</div>
      }
    </div>
  );
}

export default RemoteGame;