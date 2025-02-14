import "./TournamentGame.css"
import vs from "../../../../../Home/images/Group.svg"
import { TournamentGameData } from "../TournamentForm/TournamentForm";

interface TournamentGameProps {
  game?: TournamentGameData |null,
}

function TournamentGame({ game }: TournamentGameProps) {
  return (
    <div className="TournamentGame">
      <div className="TournamentGameLeft">
        <span>{game ? game.player1.alias : "-----------------"}</span>
      </div>
      <div className="TournamentGameResult">
        <div> {game ? game.player1.score : "0"} </div>
        <img src={vs} />
        <div> {game ? game.player2.score : "0"} </div>
      </div>
      <div className="TournamentGameRight">
        <span>{game ? game.player2.alias : "-----------------"}</span>
      </div>
    </div>
  );
}

export default TournamentGame;
