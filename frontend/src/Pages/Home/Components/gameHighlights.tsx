import { useState } from 'react';
import GameRank from './GameRank';
import LastGame from './LastGame';
import TournamentHestory from './TournamentHestory';
import '../styles/GameHighlights.css';

function GameHighlights() {
  const [type, setType] = useState('GameRank')
  return (
    <div className="highlights">
      <h2>Games Highlights</h2>
      <div className="highlights-types">
        <div className="choisesParent">
          <div className="first-tab" onClick={() => setType('GameRank')}>
            <div className={`gameRank-btn ${type === 'GameRank' ? 'rank-tab' : (type === 'Tournament' ? 'rankZero' : '')}`} >
              <span>Leaderboard</span>
            </div>
          </div>
          <div className="second-tab" onClick={() => setType('LastGame')}>
            <div className={`LastGame-btn ${type === 'LastGame' ? 'lastgame-tab' : (type === 'Tournament' ? 'lastgameZero' : '')}`} >
              <span>Last Games</span>
            </div>
          </div>
          <div className="third-tab" onClick={() => setType('Tournament')}>
            <div className={`Tournament-btn ${type === 'Tournament' ? 'tournament-tab' : (type === 'GameRank' ? 'tournamentOne' : 'tournamentTwo')}`} >
              <span>Tournament</span>
            </div>
          </div>
        </div>
        {
          type === 'GameRank' &&
          <div className="TopPlayers">
            <GameRank />
          </div>
        }
        {
          type === 'LastGame' &&
          <div className="TopPlayers">
            <LastGame />
          </div>
        }
        {
          type === 'Tournament' &&
          <div className="TopPlayers">
            <TournamentHestory/>
          </div>
        }
      </div>
    </div>
  );
}

export default GameHighlights;
