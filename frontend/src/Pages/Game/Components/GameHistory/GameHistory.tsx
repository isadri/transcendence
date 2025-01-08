import LastGame from "../../../Home/Components/LastGame";
import GameHistoryitem from "../gameHistoryItem/GameHistoryitem";
import "./GameHistory.css"

function GameHistory() {
    return (
      <div className="Game-history">
        <h2>Game History</h2>
        <div className="Game-history-list">
            <LastGame/>
        </div>
      </div>
    );
}

export default GameHistory;