import "./TournamentGame.css"
import vs from "../../../../../home/images/Group.svg"
import { TournamentGameData } from "../TournamentForm/TournamentForm";

interface TournamentGameProps {
  game?: TournamentGameData |null,
}

function TournamentGame({ game }: TournamentGameProps) {
  return (
    <div className="GameHistoryItem">
      <div className="GameHistoryItemLeft">
        {/* <img src={avatar}/> */}
        <span>{game ? game.player1.alias : "-----------------"}</span>
      </div>
      <div className="GameHistoryItemResult">
        <div> {game ? game.player1.score : "0"} </div>
        <img src={vs} />
        <div> {game ? game.player2.score : "0"} </div>
      </div>
      <div className="GameHistoryItemRight">
        <span>{game ? game.player2.alias : "-----------------"}</span>
        {/* <img src={avatar}/> */}
      </div>
    </div>
  );
}

export default TournamentGame;