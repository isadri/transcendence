import React, { useState } from 'react';
import GameRank from './GameRank';
import LastGame from './LastGame';
import '../styles/GameHighlights.css';

function GameHighlights() {
  const [type, setType] = useState('GameRank')
  return (
    <div className="highlights">
      <h2>Games Highlights</h2>
      <div className="highlights-types">
        <div className="choisesParent">
          {/* Game Rank Tab */}
          <div className="first-tab" onClick={() => setType('GameRank')}>
            <div className={`gameRank-btn ${type === 'GameRank' ? 'rank-tab' : ''}`} >
              <span>Game Rank</span>
            </div>
          </div>
          {/* Last Games Tab */}
          <div className="second-tab" onClick={() => setType('LastGame')}>
            <div className={`LastGame-btn ${type === 'LastGame' ? 'lastgame-tab' : ''}`} >
              <span>Last Games</span>
            </div>
          </div>
        </div>
        {
          type === 'GameRank' ? 
          <div className="TopPlayers">
            <GameRank />
          </div>
          :
          <div className="TopPlayers">
            <LastGame />
          </div>
        }
      </div>
      {/* Uncomment to include LastGame */}
      {/* <LastGame /> */}
    </div>
  );
}

export default GameHighlights;
