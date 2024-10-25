import GameModes from "../Home/Components/GameModes"
import GameHistory from "./Components/GameHistory/GameHistory"
import './Game.css'

const Game = () => {
  return (
    <div className="game-page-container">
      <GameModes/>
      <GameHistory/>
    </div>
  )
}

export default Game